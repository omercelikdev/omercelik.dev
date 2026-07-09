"use client";

import { useEffect, useState } from "react";

/** Types each phrase in, holds, deletes, moves to the next — looping. Used for
 *  the hero's rotating focus areas. Purely cosmetic; the full first phrase is
 *  rendered on the server for SEO/no-JS via `children` fallback if provided. */
export function Typewriter({
  phrases,
  typingMs = 55,
  deletingMs = 28,
  holdMs = 1600,
}: {
  phrases: string[];
  typingMs?: number;
  deletingMs?: number;
  holdMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(
      () => {
        setText((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1),
        );
      },
      deleting ? deletingMs : typingMs,
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, phrases, typingMs, deletingMs, holdMs]);

  return (
    <span className="text-brand-accent">
      {text}
      <span className="caret" aria-hidden>
        .
      </span>
    </span>
  );
}
