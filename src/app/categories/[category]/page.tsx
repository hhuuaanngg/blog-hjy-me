import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostList } from "@/components/post/post-list";
import {
  getAllCategories,
  getPostsByCategory,
  normalizeCategorySlug
} from "@/lib/content/categories";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category: category.slug
  }));
}

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const normalizedCategorySlug = normalizeCategorySlug(category);
  const matchedCategory = getAllCategories().find(
    (item) => item.slug === normalizedCategorySlug
  );

  if (!matchedCategory) {
    return {};
  }

  return {
    title: `分类：${matchedCategory.category}`,
    description: `查看分类 ${matchedCategory.category} 下的所有文章。`,
    alternates: {
      canonical: `/categories/${matchedCategory.slug}`
    }
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const normalizedCategorySlug = normalizeCategorySlug(category);
  const matchedCategory = getAllCategories().find(
    (item) => item.slug === normalizedCategorySlug
  );

  if (!matchedCategory) {
    notFound();
  }

  const posts = getPostsByCategory(normalizedCategorySlug);

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {matchedCategory.category}
        </h1>
        <p className="text-lg text-slate-600">
          共找到 {matchedCategory.count} 篇相关文章。
        </p>
      </div>

      <PostList posts={posts} />
    </section>
  );
}
