import type { MetadataRoute } from "next";

import { getAllCategories } from "@/lib/content/categories";
import { getTotalPages } from "@/lib/content/pagination";
import { getAllPages } from "@/lib/content/pages";
import { getAllPosts } from "@/lib/content/posts";
import { getAllTags } from "@/lib/content/tags";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const contentSlugs = new Set([
    ...posts.map((post) => post.slug),
    ...getAllPages().map((page) => page.slug)
  ]);
  const totalPages = getTotalPages(posts.length);

  const homepage = {
    url: siteUrl,
    lastModified: new Date()
  };

  const contentPages = Array.from(contentSlugs).map((slug) => ({
    url: `${siteUrl}/${slug}`,
    lastModified: new Date()
  }));

  const paginatedPages = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => ({
      url: `${siteUrl}/page/${index + 2}`,
      lastModified: new Date()
    })
  );

  const tags = [
    {
      url: `${siteUrl}/tags`,
      lastModified: new Date()
    },
    ...getAllTags().map((tag) => ({
      url: `${siteUrl}/tags/${tag.slug}`,
      lastModified: new Date()
    }))
  ];

  const categories = [
    {
      url: `${siteUrl}/categories`,
      lastModified: new Date()
    },
    ...getAllCategories().map((category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
      lastModified: new Date()
    }))
  ];

  return [homepage, ...paginatedPages, ...contentPages, ...tags, ...categories];
}
