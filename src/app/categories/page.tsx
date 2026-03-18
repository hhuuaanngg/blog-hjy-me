import Link from "next/link";

import { getAllCategories } from "@/lib/content/categories";

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          分类
        </h1>
        <p className="text-lg text-slate-600">按栏目浏览文章，查看每个主题下的内容归档。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-900"
          >
            <span className="text-base font-medium text-slate-950">
              {category.category}
            </span>
            <span className="text-sm text-slate-500">{category.count} 篇</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
