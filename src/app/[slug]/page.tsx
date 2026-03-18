import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostAdjacentNav } from "@/components/post/post-adjacent-nav";
import { CommentList } from "@/components/comment/comment-list";
import { PostContent } from "@/components/post/post-content";
import { PostMeta } from "@/components/post/post-meta";
import { PostTableOfContents } from "@/components/post/post-table-of-contents";
import { getAllPages, getPageBySlug } from "@/lib/content/pages";
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug
} from "@/lib/content/posts";

type ContentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}

export async function generateStaticParams() {
  const slugs = new Set([
    ...getAllPosts().map((post) => post.slug),
    ...getAllPages().map((page) => page.slug)
  ]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: ContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (page) {
    return {
      title: page.title,
      description: `${page.title} 页面`,
      alternates: {
        canonical: `/${page.slug}`
      }
    };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      url: `/${post.slug}`,
      images: post.cover ? [{ url: post.cover, alt: post.title }] : undefined
    }
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (page) {
    return (
      <article className="space-y-8">
        <header className="space-y-2">
          <p className="text-sm text-slate-500">{formatDate(page.date)}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            {page.title}
          </h1>
        </header>

        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: page.contentHtml }}
        />
      </article>
    );
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { previousPost, nextPost } = getAdjacentPosts(slug);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-14">
      <div className="min-w-0 space-y-8">
        <PostContent
          title={post.title}
          date={post.date}
          category={post.category}
          tags={post.tags}
          cover={post.cover}
          contentHtml={post.contentHtml}
        />
        <PostMeta
          slug={post.slug}
          title={post.title}
          date={post.date}
          tags={post.tags}
        />
        <PostAdjacentNav previousPost={previousPost} nextPost={nextPost} />
        <CommentList slug={post.slug} />
      </div>

      {post.headings.length > 0 ? (
        <aside className="hidden lg:block">
          <PostTableOfContents headings={post.headings} />
        </aside>
      ) : null}
    </div>
  );
}
