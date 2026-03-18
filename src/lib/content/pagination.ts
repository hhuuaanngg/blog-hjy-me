import type { PostMeta } from "@/lib/content/posts";

export const POSTS_PER_PAGE = 12;

export function getTotalPages(postsCount: number): number {
  return Math.max(1, Math.ceil(postsCount / POSTS_PER_PAGE));
}

export function normalizePageNumber(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), totalPages);
}

export function parsePageNumber(value: string): number | null {
  const page = Number.parseInt(value, 10);

  if (Number.isNaN(page) || page < 1) {
    return null;
  }

  return page;
}

export function getPageHref(page: number): string {
  if (page <= 1) {
    return "/";
  }

  return `/page/${page}`;
}

export function getPostsForPage(posts: PostMeta[], page: number): PostMeta[] {
  const startIndex = (page - 1) * POSTS_PER_PAGE;

  return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
}
