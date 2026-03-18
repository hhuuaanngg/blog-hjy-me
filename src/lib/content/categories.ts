import { getAllPosts, type PostMeta } from "@/lib/content/posts";

export type CategoryWithCount = {
  category: string;
  slug: string;
  count: number;
};

export function slugifyCategory(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCategorySlug(categorySlug: string): string {
  try {
    return decodeURIComponent(categorySlug);
  } catch {
    return categorySlug;
  }
}

export function getAllCategories(): CategoryWithCount[] {
  const categoryMap = new Map<string, CategoryWithCount>();

  for (const post of getAllPosts()) {
    const normalizedCategory = post.category.trim();

    if (!normalizedCategory) {
      continue;
    }

    const slug = slugifyCategory(normalizedCategory);
    const existing = categoryMap.get(slug);

    if (existing) {
      existing.count += 1;
    } else {
      categoryMap.set(slug, {
        category: normalizedCategory,
        slug,
        count: 1
      });
    }
  }

  return Array.from(categoryMap.values()).sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.category.localeCompare(right.category);
  });
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  const normalizedSlug = normalizeCategorySlug(categorySlug);

  return getAllPosts().filter(
    (post) => post.category && slugifyCategory(post.category) === normalizedSlug
  );
}
