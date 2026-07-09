"use client";

import { useState } from "react";

/** Loads the repo's GitHub preview image from the visitor's browser (spreads
 *  load, avoids server-side rate limits). If it fails or is rate-limited,
 *  falls back to a generated brand cover — never a broken image. */
export function ProductCover({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="grid size-full place-items-center bg-[linear-gradient(135deg,var(--brand-accent-soft),transparent)]">
        <span className="mono text-lg font-medium text-muted-foreground">
          {name}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}
