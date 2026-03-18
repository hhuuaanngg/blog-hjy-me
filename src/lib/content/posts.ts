import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { markdownToHtml, type PostHeading } from "@/lib/content/markdown";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type PostFrontmatter = {
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  cover: string;
  draft: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
};

export type Post = PostMeta & {
  content: string;
  contentHtml: string;
  headings: PostHeading[];
};

function isMarkdownFile(fileName: string): boolean {
  return fileName.endsWith(".md") || fileName.endsWith(".markdown");
}

function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs.readdirSync(postsDirectory).filter(isMarkdownFile);
}

function getPostSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.(md|markdown)$/, "");
}

function resolvePostFilePath(slug: string): string | null {
  const supportedExtensions = [".md", ".markdown"];

  for (const extension of supportedExtensions) {
    const filePath = path.join(postsDirectory, `${slug}${extension}`);

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

function normalizePostFrontmatter(
  slug: string,
  data: Record<string, unknown>
): PostFrontmatter {
  const normalizedTags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const normalizedCategory =
    typeof data.category === "string" && data.category.trim()
      ? data.category.trim()
      : normalizedTags[0] ?? "";

  return {
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : new Date().toISOString(),
    summary: typeof data.summary === "string" ? data.summary : "",
    category: normalizedCategory,
    tags: normalizedTags,
    cover: typeof data.cover === "string" ? data.cover : "",
    draft: typeof data.draft === "boolean" ? data.draft : false
  };
}

function sortPostsByDateDesc(posts: PostMeta[]): PostMeta[] {
  return [...posts].sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

export function getAllPosts(includeDrafts = false): PostMeta[] {
  const posts = getPostFiles().map((fileName) => {
    const slug = getPostSlugFromFileName(fileName);
    const filePath = path.join(postsDirectory, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    const { data } = matter(source);
    const frontmatter = normalizePostFrontmatter(
      slug,
      data as Record<string, unknown>
    );

    return {
      slug,
      ...frontmatter
    };
  });

  const filteredPosts = includeDrafts
    ? posts
    : posts.filter((post) => !post.draft);

  return sortPostsByDateDesc(filteredPosts);
}

export async function getPostBySlug(
  slug: string,
  includeDrafts = false
): Promise<Post | null> {
  const filePath = resolvePostFilePath(slug);

  if (!filePath) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = normalizePostFrontmatter(
    slug,
    data as Record<string, unknown>
  );

  if (frontmatter.draft && !includeDrafts) {
    return null;
  }

  const { contentHtml, headings } = await markdownToHtml(content);

  return {
    slug,
    content,
    contentHtml,
    headings,
    ...frontmatter
  };
}

export function getAdjacentPosts(slug: string): {
  previousPost: PostMeta | null;
  nextPost: PostMeta | null;
} {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return {
      previousPost: null,
      nextPost: null
    };
  }

  return {
    previousPost: posts[currentIndex - 1] ?? null,
    nextPost: posts[currentIndex + 1] ?? null
  };
}
