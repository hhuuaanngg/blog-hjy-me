import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostList } from "@/components/post/post-list";
import {
  getAllTags,
  getPostsByTag,
  normalizeTagSlug
} from "@/lib/content/tags";

type TagPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: tag.slug
  }));
}

export async function generateMetadata({
  params
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const normalizedTagSlug = normalizeTagSlug(tag);
  const matchedTag = getAllTags().find(
    (item) => item.slug === normalizedTagSlug
  );

  if (!matchedTag) {
    return {};
  }

  return {
    title: `标签：${matchedTag.tag}`,
    description: `查看标签 ${matchedTag.tag} 下的所有文章。`,
    alternates: {
      canonical: `/tags/${matchedTag.slug}`
    }
  };
}

export default async function TagDetailPage({ params }: TagPageProps) {
  const { tag } = await params;
  const normalizedTagSlug = normalizeTagSlug(tag);
  const matchedTag = getAllTags().find(
    (item) => item.slug === normalizedTagSlug
  );

  if (!matchedTag) {
    notFound();
  }

  const posts = getPostsByTag(normalizedTagSlug);

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          #{matchedTag.tag}
        </h1>
        <p className="text-lg text-slate-600">
          共找到 {matchedTag.count} 篇相关文章。
        </p>
      </div>

      <PostList posts={posts} />
    </section>
  );
}
