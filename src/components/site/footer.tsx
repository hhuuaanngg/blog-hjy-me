export function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Markdown Blog. Built with Next.js.</p>
        <p>Node.js / Docker friendly deployment.</p>
      </div>
    </footer>
  );
}
