"use client";

import { useEffect, useState } from "react";

import type { PostHeading } from "@/lib/content/markdown";

type PostTableOfContentsProps = {
  headings: PostHeading[];
};

const ACTIVE_HEADING_OFFSET = 140;

export function PostTableOfContents({
  headings
}: PostTableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const updateActiveId = () => {
      let nextActiveId = headings[0]?.id ?? "";

      for (const heading of headings) {
        const element = document.getElementById(heading.id);

        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET) {
          nextActiveId = heading.id;
        } else {
          break;
        }
      }

      setActiveId((currentId) =>
        currentId === nextActiveId ? currentId : nextActiveId
      );
    };

    updateActiveId();
    window.addEventListener("scroll", updateActiveId, { passive: true });
    window.addEventListener("resize", updateActiveId);

    return () => {
      window.removeEventListener("scroll", updateActiveId);
      window.removeEventListener("resize", updateActiveId);
    };
  }, [headings]);

  return (
    <nav
      aria-label="文章目录"
      className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
    >
      <div className="relative pl-5">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-px bg-slate-200"
        />
        <p className="mb-4 text-base font-semibold tracking-tight text-slate-950">
          本文导览
        </p>
        <ol className="space-y-2.5">
          {headings.map((heading) => {
            const isActive = heading.id === activeId;
            const indentClass =
              heading.level === 2
                ? ""
                : heading.level === 3
                  ? "pl-3"
                  : "pl-5";

            return (
              <li key={heading.id} className={`relative ${indentClass}`}>
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute -left-5 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-sky-500"
                  />
                ) : null}
                <a
                  href={`#${heading.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`block text-sm leading-6 transition ${
                    isActive
                      ? "font-medium text-slate-900"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
