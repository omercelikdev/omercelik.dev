import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

import type { WritingMeta } from "@/lib/writings";

/** A writing as a list row: title on the left, date on the right, hairline
 *  divider, slides right on hover. */
export function PostRow({ post }: { post: WritingMeta }) {
  const locale = useLocale();
  const dateLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
  }).format(new Date(post.date));

  return (
    <Link
      href={`/writings/${post.slug}`}
      className="group flex items-baseline justify-between gap-6 border-b border-border py-5"
    >
      <span className="flex flex-col gap-1">
        <span className="text-[15px] transition-colors group-hover:text-brand-accent">
          {post.title}
        </span>
        {post.description && (
          <span className="line-clamp-1 max-w-xl text-[13px] text-muted-foreground">
            {post.description}
          </span>
        )}
      </span>
      <span className="mono flex flex-none items-center gap-2 text-[12px] text-muted-foreground">
        <span className="rounded-[var(--radius-sm)] border border-border px-1.5 py-0.5 text-[10px] uppercase text-faint">
          {post.lang}
        </span>
        {dateLabel}
      </span>
    </Link>
  );
}
