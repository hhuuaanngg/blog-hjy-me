import fs from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";

const FEED_URL = process.env.WP_FEED_URL ?? "https://hjy.me/feed/";
const SITE_ORIGIN = "https://hjy.me";
const OUTPUT_DIR = process.env.WP_OUTPUT_DIR
  ? path.resolve(process.env.WP_OUTPUT_DIR)
  : path.resolve("content", "posts");
const IMAGES_BASE = path.resolve(process.cwd(), "public", "images", "wp-import");

const FORCE = process.argv.includes("--force");
const SKIP_IMAGES = process.argv.includes("--no-images");
const LIMIT_ARG = process.argv.find((arg) => arg.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? Number(LIMIT_ARG.slice("--limit=".length)) : undefined;

function stripHtml(html) {
  return decodeHtmlEntities(String(html ?? ""))
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(input) {
  // 覆盖最常见的 XML/HTML 实体（RSS description 里经常出现）
  return String(input ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    );
}

function sanitizeSlug(input) {
  const raw = String(input ?? "").trim().toLowerCase();
  const cleaned = raw
    .replace(/https?:\/\/[^/]+/g, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9\-/_]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "post";
}

function slugFromItem(item) {
  const link = item?.link;
  if (typeof link === "string" && link.trim()) return sanitizeSlug(link);
  const guid = item?.guid;
  if (typeof guid === "string" && guid.trim()) return sanitizeSlug(guid);
  if (typeof guid?.["#text"] === "string" && guid["#text"].trim()) return sanitizeSlug(guid["#text"]);
  const title = item?.title;
  return sanitizeSlug(title);
}

function normalizeDateToYYYYMMDD(dateInput) {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return undefined;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getItemCategories(item) {
  const cats = ensureArray(item?.category)
    .map((c) => (typeof c === "string" ? c : c?.["#text"]))
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter(Boolean);
  return cats;
}

function getItemContentHtml(item) {
  const raw =
    (
    item?.["content:encoded"] ??
    item?.contentencoded ??
    item?.encoded ??
    item?.content ??
    ""
  );
  return decodeHtmlEntities(raw);
}

const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|svg)(?:\?[^"'\s)]*)?$/i;

function extractImageUrls(html, baseOrigin = SITE_ORIGIN) {
  const urls = new Set();
  if (!html || typeof html !== "string") return urls;

  // HTML: src="..." and href="..."
  const srcHrefRe = /(?:src|href)=["']([^"']+)["']/gi;
  let m;
  while ((m = srcHrefRe.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!IMAGE_EXT_RE.test(raw)) continue;
    const absolute = raw.startsWith("http") ? raw : new URL(raw, baseOrigin).href;
    urls.add(absolute);
  }

  // Markdown-style: ](url) or ![](url)
  const mdRe = /!?\[[^\]]*\]\((https?:\/\/[^)]+)\)/g;
  while ((m = mdRe.exec(html)) !== null) {
    const u = m[1].trim();
    if (IMAGE_EXT_RE.test(u)) urls.add(u);
  }

  return urls;
}

function sanitizeFilename(url) {
  try {
    const p = new URL(url).pathname;
    const base = path.basename(p);
    const safe = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "image";
    return safe;
  } catch {
    return "image.jpg";
  }
}

async function downloadImage(url, dir, fetchOpts = {}) {
  const res = await fetch(url, {
    headers: { "user-agent": "hjy.me wp feed importer (node)", ...fetchOpts.headers },
    ...fetchOpts,
  });
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const name = sanitizeFilename(url);
  const destPath = path.join(dir, name);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(destPath, buf);
  return name;
}

async function downloadImagesAndBuildUrlMap(html, postSlug) {
  const urls = extractImageUrls(html);
  const urlToLocal = new Map();
  const dir = path.join(IMAGES_BASE, postSlug);

  for (const url of urls) {
    try {
      const name = await downloadImage(url, dir);
      const localPath = `/images/wp-import/${postSlug}/${name}`;
      urlToLocal.set(url, localPath);
      try {
        const u = new URL(url);
        if (u.search) urlToLocal.set(u.origin + u.pathname, localPath);
        urlToLocal.set(u.pathname, localPath);
      } catch {}
    } catch (err) {
      console.warn(`[wp-import] skip image ${url}:`, err.message);
    }
  }

  return urlToLocal;
}

function replaceImageUrlsInContent(html, urlToLocal) {
  let out = html;
  const byLength = [...urlToLocal.entries()].sort((a, b) => (b[0].length || 0) - (a[0].length || 0));
  for (const [urlOrPath, localPath] of byLength) {
    out = out.split(urlOrPath).join(localPath);
  }
  // 只保留主图 src，去掉 srcset/sizes，避免残留远程地址
  out = out.replace(/\ssrcset="[^"]*"/gi, "");
  out = out.replace(/\ssizes="[^"]*"/gi, "");
  return out;
}

function buildTurndown() {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    bulletListMarker: "-",
  });

  // 你的站点 Markdown 渲染链路允许 HTML；这些复杂块保留为 HTML 更稳妥。
  service.keep([
    "figure",
    "figcaption",
    "iframe",
    "video",
    "audio",
    "source",
    "script",
    "embed",
  ]);

  // WordPress 表情/emoji 图片：保留 alt 文字即可
  service.addRule("wpSmiley", {
    filter: (node) =>
      node.nodeName === "IMG" &&
      (node.getAttribute("class") || "").includes("wp-smiley"),
    replacement: (_content, node) => node.getAttribute("alt") || "",
  });

  // WordPress “more” 分隔符：直接丢弃
  service.addRule("wpMore", {
    filter: (node) =>
      node.nodeName === "SPAN" && (node.getAttribute("id") || "").startsWith("more-"),
    replacement: () => "",
  });

  return service;
}

async function main() {
  console.log(`[wp-import] feed: ${FEED_URL}`);
  console.log(`[wp-import] out:  ${OUTPUT_DIR}`);

  const res = await fetch(FEED_URL, {
    headers: {
      "user-agent": "hjy.me wp feed importer (node)",
      accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch feed failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    // 不强依赖命名空间写法，兼容不同 RSS 输出
    ignoreDeclaration: true,
    processEntities: true,
  });

  const parsed = parser.parse(xml);
  const channel = parsed?.rss?.channel ?? parsed?.channel;
  const items = ensureArray(channel?.item);

  if (!items.length) {
    console.log("[wp-import] no items found.");
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const turndown = buildTurndown();
  const slice = typeof LIMIT === "number" && Number.isFinite(LIMIT) ? items.slice(0, LIMIT) : items;

  let wrote = 0;
  let skipped = 0;

  for (const item of slice) {
    const title = stripHtml(item?.title) || "Untitled";
    const dateRaw = item?.pubDate ?? item?.date ?? item?.["dc:date"];
    const date = normalizeDateToYYYYMMDD(dateRaw) ?? "1970-01-01";

    const categories = getItemCategories(item);
    const category = categories[0] || "Uncategorized";
    const tags = categories.slice(1);

    const contentHtml = String(getItemContentHtml(item) ?? "").trim();
    const description = stripHtml(item?.description);
    const fallbackSummary = stripHtml(contentHtml).slice(0, 180);
    const summary = (description || fallbackSummary || title).trim();

    const slug = slugFromItem(item);
    const filename = `${slug}.md`;
    const outPath = path.join(OUTPUT_DIR, filename);

    if (!FORCE) {
      try {
        await fs.access(outPath);
        skipped++;
        continue;
      } catch {
        // not exists
      }
    }

    let contentToConvert = contentHtml;
    if (!SKIP_IMAGES && contentHtml) {
      try {
        const urlToLocal = await downloadImagesAndBuildUrlMap(contentHtml, slug);
        if (urlToLocal.size) contentToConvert = replaceImageUrlsInContent(contentHtml, urlToLocal);
      } catch (err) {
        console.warn(`[wp-import] images for ${slug}:`, err.message);
      }
    }

    const bodyMd = contentToConvert ? turndown.turndown(contentToConvert).trim() : "";
    const link = typeof item?.link === "string" ? item.link.trim() : "";

    const frontmatterLines = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `date: ${JSON.stringify(date)}`,
      `summary: ${JSON.stringify(summary)}`,
      `category: ${JSON.stringify(category)}`,
      "tags:",
      ...(tags.length ? tags.map((t) => `  - ${JSON.stringify(t)}`) : ["  - Imported"]),
      "cover: \"\"",
      "draft: false",
      "---",
      "",
    ];

    const contentLines = [
      ...frontmatterLines,
      link ? `> 原文：${link}\n` : "",
      bodyMd,
      "",
    ];

    await fs.writeFile(outPath, contentLines.join("\n"), "utf8");
    wrote++;
  }

  console.log(`[wp-import] wrote:   ${wrote}`);
  console.log(`[wp-import] skipped: ${skipped}${FORCE ? " (force enabled)" : ""}`);
}

main().catch((err) => {
  console.error("[wp-import] failed:", err);
  process.exitCode = 1;
});

