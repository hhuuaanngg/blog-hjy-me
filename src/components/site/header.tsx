import Link from "next/link";

const navigation = [
  { href: "/categories", label: "分类" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" }
];

const socialLinks = [
  {
    href: "https://github.com/",
    label: "GitHub",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.37 6.839 9.727.5.096.682-.222.682-.494 0-.244-.009-.89-.014-1.747-2.782.617-3.369-1.37-3.369-1.37-.455-1.181-1.11-1.496-1.11-1.496-.908-.636.069-.623.069-.623 1.004.072 1.532 1.056 1.532 1.056.892 1.568 2.341 1.115 2.91.853.091-.663.35-1.115.636-1.371-2.22-.26-4.555-1.14-4.555-5.073 0-1.12.389-2.036 1.029-2.754-.103-.261-.446-1.311.098-2.734 0 0 .84-.276 2.75 1.052A9.35 9.35 0 0 1 12 6.827a9.3 9.3 0 0 1 2.504.348c1.909-1.328 2.747-1.052 2.747-1.052.546 1.423.203 2.473.1 2.734.64.718 1.027 1.634 1.027 2.754 0 3.943-2.339 4.81-4.566 5.064.359.319.679.948.679 1.912 0 1.381-.012 2.495-.012 2.834 0 .274.18.594.688.493C19.138 20.62 22 16.78 22 12.253 22 6.59 17.523 2 12 2Z" />
      </svg>
    )
  },
  {
    href: "https://x.com/",
    label: "X",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M18.901 2H21l-4.584 5.24L21.81 22h-4.226l-3.31-8.655L6.702 22H4.6l4.9-5.602L2 2h4.334l2.992 7.834L18.901 2Zm-1.482 18h1.164L5.704 3.896H4.456L17.42 20Z" />
      </svg>
    )
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.25" />
        <circle cx="12" cy="12" r="3.75" />
        <circle cx="17.25" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    href: "/rss.xml",
    label: "RSS",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4"
      >
        <path d="M5 17.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" fill="currentColor" stroke="none" />
        <path d="M4.5 10.5a9 9 0 0 1 9 9" />
        <path d="M4.5 5a14.5 14.5 0 0 1 14.5 14.5" />
      </svg>
    )
  }
];

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
          Markdown Blog
        </Link>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <nav className="flex items-center gap-5">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <span aria-hidden="true" className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 transition hover:text-slate-950"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <span aria-hidden="true" className="h-4 w-px bg-slate-200" />

          <button
            type="button"
            aria-label="搜索（预留）"
            title="搜索（预留）"
            className="text-slate-500 transition hover:text-slate-950"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
