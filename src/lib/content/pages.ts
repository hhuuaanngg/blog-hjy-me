import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { markdownToHtml } from "@/lib/content/markdown";

const pagesDirectory = path.join(process.cwd(), "content", "pages");

export type StaticPageFrontmatter = {
  title: string;
  date: string;
};

export type StaticPageMeta = StaticPageFrontmatter & {
  slug: string;
};

export type StaticPage = StaticPageMeta & {
  content: string;
  contentHtml: string;
};

function isMarkdownFile(fileName: string): boolean {
  return fileName.endsWith(".md") || fileName.endsWith(".markdown");
}

function getPageFiles(): string[] {
  if (!fs.existsSync(pagesDirectory)) {
    return [];
  }

  return fs.readdirSync(pagesDirectory).filter(isMarkdownFile);
}

function getPageSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.(md|markdown)$/, "");
}

function resolvePageFilePath(slug: string): string | null {
  const supportedExtensions = [".md", ".markdown"];

  for (const extension of supportedExtensions) {
    const filePath = path.join(pagesDirectory, `${slug}${extension}`);

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

function normalizePageFrontmatter(
  slug: string,
  data: Record<string, unknown>
): StaticPageFrontmatter {
  return {
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : new Date().toISOString()
  };
}

function sortPagesByDateDesc(pages: StaticPageMeta[]): StaticPageMeta[] {
  return [...pages].sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

export function getAllPages(): StaticPageMeta[] {
  const pages = getPageFiles().map((fileName) => {
    const slug = getPageSlugFromFileName(fileName);
    const filePath = path.join(pagesDirectory, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);
    const frontmatter = normalizePageFrontmatter(
      slug,
      data as Record<string, unknown>
    );

    return {
      slug,
      ...frontmatter
    };
  });

  return sortPagesByDateDesc(pages);
}

export async function getPageBySlug(slug: string): Promise<StaticPage | null> {
  const filePath = resolvePageFilePath(slug);

  if (!filePath) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = normalizePageFrontmatter(
    slug,
    data as Record<string, unknown>
  );
  const { contentHtml } = await markdownToHtml(content);

  return {
    slug,
    content,
    contentHtml,
    ...frontmatter
  };
}
