import Link from "next/link";

import { getAllTags } from "@/lib/content/tags";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          标签
        </h1>
        <p className="text-lg text-slate-600">按主题浏览文章，快速找到相关内容。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-900"
          >
            <span className="text-base font-medium text-slate-950">#{tag.tag}</span>
            <span className="text-sm text-slate-500">{tag.count} 篇</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
