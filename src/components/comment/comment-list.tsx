"use client";

import Giscus from "@giscus/react";

type CommentListProps = {
  slug: string;
};

const giscusConfig = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID
};

function hasMissingConfig() {
  return Object.values(giscusConfig).some((value) => !value);
}

export function CommentList({ slug }: CommentListProps) {
  const missingConfig = hasMissingConfig();

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-950">评论</h2>
        <p className="text-sm text-slate-500">
          使用 GitHub Discussions 承载评论，登录 GitHub 后即可参与讨论。
        </p>
      </div>

      {missingConfig ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          请先配置 `NEXT_PUBLIC_GISCUS_REPO`、`NEXT_PUBLIC_GISCUS_REPO_ID`、
          `NEXT_PUBLIC_GISCUS_CATEGORY` 和 `NEXT_PUBLIC_GISCUS_CATEGORY_ID`，
          然后重新启动应用。
        </div>
      ) : (
        <Giscus
          repo={giscusConfig.repo! as `${string}/${string}`}
          repoId={giscusConfig.repoId!}
          category={giscusConfig.category!}
          categoryId={giscusConfig.categoryId!}
          mapping="specific"
          term={`post:${slug}`}
          strict="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="light"
          lang="zh-CN"
          loading="lazy"
        />
      )}
    </section>
  );
}
