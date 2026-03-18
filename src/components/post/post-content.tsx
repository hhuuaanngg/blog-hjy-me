import Image from "next/image";

import { CategoryBadge } from "@/components/site/category-badge";
import { TagBadge } from "@/components/site/tag-badge";

type PostContentProps = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  contentHtml: string;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}

export function PostContent({
  title,
  date,
  category,
  tags,
  cover,
  contentHtml
}: PostContentProps) {
  return (
    <article className="space-y-8">
      {cover ? (
        <header className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 896px, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                
                <p className="text-sm text-white/75">{formatDate(date)}</p>
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              <div className="flex flex-wrap gap-2">
              {category ? (
                  <CategoryBadge category={category} variant="inverse" />
                ) : null}
              </div>
            </div>
          </div>
        </header>
      ) : (
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {category ? <CategoryBadge category={category} /> : null}
            <p className="text-sm text-slate-500">{formatDate(date)}</p>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge key={`${title}-${tag}`} tag={tag} />
            ))}
          </div>
        </header>
      )}

      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
