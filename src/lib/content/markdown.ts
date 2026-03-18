import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1")
    .trim();
}

function slugifyHeading(text: string): string {
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "section";
}

function extractHeadings(markdown: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const slugCount = new Map<string, number>();
  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = line.match(/^\s{0,3}(#{2,4})\s+(.*?)\s*#*\s*$/);

    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3 | 4;
    const text = stripInlineMarkdown(match[2]);

    if (!text) {
      continue;
    }

    const baseId = slugifyHeading(text);
    const duplicateCount = slugCount.get(baseId) ?? 0;
    const id = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`;

    slugCount.set(baseId, duplicateCount + 1);
    headings.push({
      id,
      text,
      level
    });
  }

  return headings;
}

function injectHeadingIds(contentHtml: string, headings: PostHeading[]): string {
  let headingIndex = 0;

  return contentHtml.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (match, levelText) => {
    const heading = headings[headingIndex];
    const level = Number(levelText) as 2 | 3 | 4;

    if (!heading || heading.level !== level) {
      return match;
    }

    headingIndex += 1;
    return match.replace(`<h${level}>`, `<h${level} id="${heading.id}">`);
  });
}

export async function markdownToHtml(
  markdown: string
): Promise<{ contentHtml: string; headings: PostHeading[] }> {
  const headings = extractHeadings(markdown);
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  const contentHtml = injectHeadingIds(result.toString(), headings);

  return {
    contentHtml,
    headings
  };
}
