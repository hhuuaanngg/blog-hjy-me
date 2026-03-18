import Link from "next/link";

import { PostPagination } from "@/components/post/post-pagination";
import { PostList } from "@/components/post/post-list";
import { getAllCategories } from "@/lib/content/categories";
import {
  getPostsForPage,
  getTotalPages
} from "@/lib/content/pagination";
import { getAllPosts } from "@/lib/content/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const featuredCategories = getAllCategories().slice(0, 6);
  const totalPages = getTotalPages(posts.length);
  const visiblePosts = getPostsForPage(posts, 1);

  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <nav
          aria-label="首页分类菜单"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="text-sm font-semibold text-slate-800 transition hover:text-slate-950"
            >
              #{category.category}
            </Link>
          ))}
        </nav>
      </div>

      <PostList posts={visiblePosts} />

      <PostPagination currentPage={1} totalPages={totalPages} />
    </section>
  );
}
