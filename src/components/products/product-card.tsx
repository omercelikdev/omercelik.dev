import { ArrowUpRight, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import type { Product } from "@/lib/github";

/** A project as a compact, flat case-study card — sized close to the "what I
 *  do" cards. Hairline border, no cover image, border darkens subtly on hover
 *  (no growth). Links to the project's own site when set, else to GitHub. */
export function ProductCard({ product }: { product: Product }) {
  const href = product.homepage || product.url;

  return (
    <div className="group flex h-full flex-col gap-3 rounded-[var(--radius-xl)] border border-border p-5 transition-colors duration-200 hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-[15px] font-medium tracking-tight transition-colors hover:text-brand-accent"
        >
          {product.name}
          <ArrowUpRight className="size-3.5 text-faint transition-colors group-hover:text-foreground" />
        </a>
        <span className="mono flex-none pt-0.5 text-[11px] text-faint">
          {product.year}
        </span>
      </div>

      {product.description && (
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      )}

      {product.topics.length > 0 && (
        <div className="mono flex flex-wrap gap-1.5 text-[11px] text-faint">
          {product.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-[var(--radius-sm)] border border-border px-2 py-0.5"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mono mt-auto flex items-center gap-4 pt-1 text-[12px] text-muted-foreground">
        {product.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brand-accent" aria-hidden />
            {product.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" /> {product.stars}
        </span>
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer noopener"
          className="ms-auto inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <GithubIcon className="size-3.5" /> GitHub
        </a>
      </div>
    </div>
  );
}
