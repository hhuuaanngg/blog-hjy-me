import Link from "next/link";

import { getPageHref } from "@/lib/content/pagination";

type PostPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function PostPagination({
  currentPage,
  totalPages
}: PostPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-sm text-slate-600">
        第 {currentPage} / {totalPages} 页
      </p>
      <div className="flex items-center gap-3">
        <Link
          href={getPageHref(Math.max(1, currentPage - 1))}
          aria-disabled={currentPage === 1}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-950 aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          上一页
        </Link>
        <Link
          href={getPageHref(Math.min(totalPages, currentPage + 1))}
          aria-disabled={currentPage === totalPages}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-950 aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          下一页
        </Link>
      </div>
    </div>
  );
}
