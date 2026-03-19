import { getAllPosts, type PostMeta } from "@/lib/content/posts";

export type TagWithCount = {
  tag: string;
  slug: string;
  count: number;
};

export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeTagSlug(tagSlug: string): string {
  try {
    return decodeURIComponent(tagSlug);
  } catch {
    return tagSlug;
  }
}

export function getAllTags(): TagWithCount[] {
  const tagMap = new Map<string, TagWithCount>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const normalizedTag = tag.trim();

      if (!normalizedTag) {
        continue;
      }

      const slug = slugifyTag(normalizedTag);
      const existing = tagMap.get(slug);

      if (existing) {
        existing.count += 1;
      } else {
        tagMap.set(slug, {
          tag: normalizedTag,
          slug,
          count: 1
        });
      }
    }
  }

  return Array.from(tagMap.values()).sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.tag.localeCompare(right.tag);
  });
}

export function getPostsByTag(tagSlug: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => slugifyTag(tag) === tagSlug)
  );
}
