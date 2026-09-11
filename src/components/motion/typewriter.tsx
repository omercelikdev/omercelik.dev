"use client";

import { useEffect, useState } from "react";

/** Holds a phrase, deletes it, types the next — looping. Used for the hero's
 *  rotating focus areas. Starts on the first phrase in full, so the server
 *  HTML (and anyone without JavaScript) gets a complete headline. */
export function Typewriter({
  phrases,
  typingMs = 55,
  deletingMs = 28,
  holdMs = 1800,
}: {
  phrases: string[];
  typingMs?: number;
  deletingMs?: number;
  holdMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      // A short beat before the next phrase starts typing. Scheduled rather
      // than set synchronously so the effect never cascades a render.
      const t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      }, typingMs);
      return () => clearTimeout(t);
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
      <span className="caret" aria-hidden />
    </span>
  );
}
