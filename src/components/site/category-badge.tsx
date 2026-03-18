import Link from "next/link";

import { slugifyCategory } from "@/lib/content/categories";

type CategoryBadgeProps = {
  category: string;
  variant?: "default" | "inverse";
};

export function CategoryBadge({
  category,
  variant = "default"
}: CategoryBadgeProps) {
  const className =
    variant === "inverse"
      ? "inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 hover:text-white"
      : "inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 transition hover:border-slate-900 hover:bg-white hover:text-slate-900";

  return (
    <Link
      href={`/categories/${slugifyCategory(category)}`}
      className={className}
    >
      {category}
    </Link>
  );
}
