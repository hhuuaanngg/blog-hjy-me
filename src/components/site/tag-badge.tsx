import Link from "next/link";

import { slugifyTag } from "@/lib/content/tags";

type TagBadgeProps = {
  tag: string;
  variant?: "default" | "inverse";
};

export function TagBadge({
  tag,
  variant = "default"
}: TagBadgeProps) {
  const className =
    variant === "inverse"
      ? "inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 hover:text-white"
      : "inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700 transition hover:border-slate-900 hover:text-slate-900";

  return (
    <Link
      href={`/tags/${slugifyTag(tag)}`}
      className={className}
    >
      #{tag}
    </Link>
  );
}
