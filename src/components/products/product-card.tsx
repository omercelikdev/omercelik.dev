import { ArrowUpRight, GitFork, Package, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tag } from "@/components/ui/badge";
import type { Product } from "@/lib/github";
import type { ProductAccent } from "@/config/products";

const ACCENT_TILE: Record<ProductAccent, string> = {
  violet: "text-violet bg-violet-bg border-violet-border",
  info: "text-info bg-info-bg border-info-border",
  success: "text-success bg-success-bg border-success-border",
  warning: "text-warning bg-warning-bg border-warning-border",
};

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("products");

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex flex-col gap-4 rounded-[var(--radius-2xl)] border border-border bg-background p-5 shadow-[var(--shadow-surface)] transition-all hover:border-border-strong hover:shadow-[var(--shadow-overlay)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid size-10 place-items-center rounded-[var(--radius-lg)] border ${ACCENT_TILE[product.accent]}`}
        >
          <Package className="size-5" strokeWidth={2} />
        </span>
        <ArrowUpRight className="size-4 flex-none text-faint transition-colors group-hover:text-foreground" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold tracking-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>

      {product.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.topics.slice(0, 4).map((topic) => (
            <Tag key={topic}>{topic}</Tag>
          ))}
        </div>
      )}

      <div className="mono mt-auto flex items-center gap-4 pt-1 text-[11px] text-muted-foreground">
        {product.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-violet" aria-hidden />
            {product.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1" title={t("stars")}>
          <Star className="size-3.5" /> {product.stars}
        </span>
        <span className="inline-flex items-center gap-1" title={t("forks")}>
          <GitFork className="size-3.5" /> {product.forks}
        </span>
      </div>
    </a>
  );
}
