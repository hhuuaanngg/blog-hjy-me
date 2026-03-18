import Image from "next/image";
import Link from "next/link";

import type { PostMeta } from "@/lib/content/posts";

type PostCardProps = {
  post: PostMeta;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {post.cover ? (
        <Link href={`/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              sizes="(min-width: 1024px) 896px, 100vw"
            />
          </div>
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col space-y-2.5 p-4">
        <div className="space-y-1.5">
          <h2 className="text-base font-medium tracking-tight text-slate-950">
            <Link href={`/${post.slug}`} className="hover:text-slate-700">
              {post.title}
            </Link>
          </h2>
        </div>

        <p className="mt-auto inline-flex items-center gap-1.5 text-xs text-slate-500">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5"
          >
            <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.25" />
            <path d="M8 3.75v4M16 3.75v4M3.75 9.25h16.5" />
          </svg>
          <span>{formatDate(post.date)}</span>
        </p>
      </div>
    </article>
  );
}
