"use client";

import { useState } from "react";

/** Renders /omer.jpg as a subtle black-and-white portrait. If the file isn't
 *  present yet, falls back to a monochrome initials tile — no broken image.
 *  Drop your photo at public/omer.jpg to activate it. */
export function Portrait({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-muted">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/omer.jpg"
          alt={alt}
          onError={() => setFailed(true)}
          className="size-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
        />
      ) : (
        <div className="grid size-full place-items-center">
          <span className="text-6xl font-medium text-faint">ÖÇ</span>
        </div>
      )}
    </div>
  );
}
