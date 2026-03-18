import Link from "next/link";

export default function NotFound() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          404
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          页面不存在
        </h1>
        <p className="text-slate-600">
          你访问的内容可能已被删除，或者链接地址有误。
        </p>
        <Link
          href="/"
          className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          返回首页
        </Link>
      </div>
    </section>
  );
}
