import Link from "next/link";

import { slugifyTag } from "@/lib/content/tags";
import { siteConfig } from "@/lib/site";

type PostMetaProps = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
}

function getPostUrl(slug: string): string {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  return `${baseUrl}/${slug}`;
}

function MetaRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start">
      <dt className="w-20 shrink-0 text-[12px] font-semibold text-slate-600">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-[12px] leading-5 text-slate-500">
        {children}
      </dd>
    </div>
  );
}

export function PostMeta({ slug, title, date, tags }: PostMetaProps) {
  const postUrl = getPostUrl(slug);

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-600">文章信息</h2>
        <span
          aria-hidden="true"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[11px] text-slate-500"
        >
          ©
        </span>
      </div>

      <dl className="space-y-1.5">
        <MetaRow label="作者:">{siteConfig.author}</MetaRow>
        <MetaRow label="文章标题:">{title}</MetaRow>
        <MetaRow label="发布时间:">{formatDate(date)}</MetaRow>
        <MetaRow label="文章链接:">
          <a
            href={postUrl}
            className="break-all text-slate-500 underline underline-offset-2 hover:text-slate-700"
          >
            {postUrl}
          </a>
        </MetaRow>
        <MetaRow label="版权说明:">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>{siteConfig.license}</span>
            <span
              aria-hidden="true"
              className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px] text-slate-500"
            >
              ©
            </span>
          </div>
        </MetaRow>
        <MetaRow label="标签:">
          <div className="flex flex-wrap gap-1.5">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Link
                  key={`${slug}-${tag}`}
                  href={`/tags/${slugifyTag(tag)}`}
                  className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[11px] leading-4 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                >
                  #{tag}
                </Link>
              ))
            ) : (
              <span className="text-slate-500">暂无标签</span>
            )}
          </div>
        </MetaRow>
      </dl>
    </section>
  );
}
