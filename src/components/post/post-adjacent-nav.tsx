import Image from "next/image";
import Link from "next/link";

import type { PostMeta } from "@/lib/content/posts";

type PostAdjacentNavProps = {
  previousPost: PostMeta | null;
  nextPost: PostMeta | null;
};

type NavCardProps = {
  label: string;
  post: PostMeta;
  align?: "left" | "right";
};

function NavCard({ label, post, align = "left" }: NavCardProps) {
  const contentAlignment =
    align === "right" ? "items-end text-right" : "items-start text-left";

  return (
    <Link
      href={`/${post.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
    >
      <div className="relative h-32 w-full sm:h-36">
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(min-width: 1024px) 448px, 100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-slate-950/10" />
        <div
          className={`absolute inset-x-0 bottom-0 flex gap-2 p-5 sm:p-6 ${contentAlignment}`}
        >
          <span className="text-xs font-medium tracking-wide text-white/75">
            {label}
          </span>
          <h3 className="max-w-[24rem] text-lg font-semibold leading-snug tracking-tight text-white">
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export function PostAdjacentNav({
  previousPost,
  nextPost
}: PostAdjacentNavProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  const hasBothPosts = Boolean(previousPost && nextPost);

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {previousPost ? (
        <div className={hasBothPosts ? "" : "md:col-span-2"}>
          <NavCard label="上一篇" post={previousPost} />
        </div>
      ) : null}

      {nextPost ? (
        <div className={hasBothPosts ? "" : "md:col-span-2"}>
          <NavCard label="下一篇" post={nextPost} align="right" />
        </div>
      ) : null}
    </section>
  );
}
