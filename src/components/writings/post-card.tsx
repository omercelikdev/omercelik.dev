import { ArrowRight, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Chip, Tag } from "@/components/ui/badge";
import type { WritingMeta } from "@/lib/writings";

export function PostCard({ post }: { post: WritingMeta }) {
  const t = useTranslations("writings");
  const locale = useLocale();
  const dateLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(post.date));

  return (
    <Link
      href={`/writings/${post.slug}`}
      className="group flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-border bg-background p-5 shadow-[var(--shadow-surface)] transition-all hover:border-border-strong hover:shadow-[var(--shadow-overlay)]"
    >
      <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
        <time className="mono" dateTime={post.date}>
          {dateLabel}
        </time>
        <span className="text-faint">·</span>
        <span className="mono inline-flex items-center gap-1">
          <Clock className="size-3" />
          {t("readingTime", { minutes: post.readingMinutes })}
        </span>
        <Chip tone="neutral" className="ms-auto uppercase">
          {post.lang}
        </Chip>
      </div>

      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {post.title}
      </h3>
      {post.description && (
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {post.description}
        </p>
      )}

      <div className="mt-1 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.slice(0, 3).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <ArrowRight className="size-4 flex-none text-faint transition-all group-hover:translate-x-0.5 group-hover:text-foreground rtl:rotate-180" />
      </div>
    </Link>
  );
}
