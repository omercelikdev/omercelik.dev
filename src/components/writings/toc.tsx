"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/writings";

/** How far below the top of the viewport a heading counts as "being read". */
const READING_LINE = 140;

/** Table of contents for an article: h2s, with h3s indented beneath them.
 *  Follows the reader — the section currently being read is highlighted. */
export function Toc({
  headings,
  label,
  className = "",
}: {
  headings: Heading[];
  label: string;
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= READING_LINE) current = el.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [headings]);

  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-col gap-2 border-s border-border">
        {headings.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ms-px block border-s text-ui transition-colors ${
                  h.depth === 3 ? "ps-6" : "ps-3.5"
                } ${
                  isActive
                    ? "border-brand-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
