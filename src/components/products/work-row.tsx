import { ArrowUpRight, Star } from "lucide-react";
import type { Product } from "@/lib/github";

/** A single product as a list row (Vercel/Linear style): name + description on
 *  the left, meta on the right, hairline divider, slides right on hover. */
export function WorkRow({ product }: { product: Product }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group grid grid-cols-[1fr_auto] items-center gap-6 border-b border-border py-6"
    >
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-2 text-[15px] font-medium">
          {product.name}
          <ArrowUpRight className="size-3.5 text-faint transition-colors group-hover:text-brand-accent" />
        </span>
        {product.description && (
          <span className="max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            {product.description}
          </span>
        )}
        {product.topics.length > 0 && (
          <span className="mono mt-1 flex flex-wrap gap-1.5 text-[11px] text-faint">
            {product.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="rounded-[var(--radius-sm)] border border-border px-2 py-0.5"
              >
                {topic}
              </span>
            ))}
          </span>
        )}
      </div>

      <div className="mono flex flex-col items-end gap-1.5 text-[12px] text-muted-foreground">
        {product.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brand-accent" aria-hidden />
            {product.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" /> {product.stars}
        </span>
      </div>
    </a>
  );
}
