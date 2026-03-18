import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostPagination } from "@/components/post/post-pagination";
import { PostList } from "@/components/post/post-list";
import {
  getPostsForPage,
  getTotalPages,
  normalizePageNumber,
  parsePageNumber
} from "@/lib/content/pagination";
import { getAllPosts } from "@/lib/content/posts";

type ArchivePageProps = {
  params: Promise<{
    page: string;
  }>;
};

export function generateStaticParams() {
  const totalPages = getTotalPages(getAllPosts().length);

  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    page: String(index + 2)
  }));
}

export async function generateMetadata({
  params
}: ArchivePageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = parsePageNumber(page);
  const totalPages = getTotalPages(getAllPosts().length);

  if (!pageNumber || pageNumber === 1 || pageNumber > totalPages) {
    return {};
  }

  return {
    title: `第 ${pageNumber} 页`,
    alternates: {
      canonical: `/page/${pageNumber}`
    }
  };
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { page } = await params;
  const requestedPage = parsePageNumber(page);
  const posts = getAllPosts();
  const totalPages = getTotalPages(posts.length);

  if (!requestedPage || requestedPage === 1 || requestedPage > totalPages) {
    notFound();
  }

  const currentPage = normalizePageNumber(requestedPage, totalPages);
  const visiblePosts = getPostsForPage(posts, currentPage);

  return (
    <section className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          文章归档
        </h1>
        <p className="text-lg text-slate-600">
          第 {currentPage} 页，共 {totalPages} 页。
        </p>
      </div>

      <PostList posts={visiblePosts} />
      <PostPagination currentPage={currentPage} totalPages={totalPages} />
    </section>
  );
}
