import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/badge";
import type { WritingMeta } from "@/lib/writings";

/** The essay the home page leads with (frontmatter `featured: true`). */
export function FeaturedPost({ post }: { post: WritingMeta }) {
  const t = useTranslations("home");
  const w = useTranslations("writings");
  const dateLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.date));

  return (
    <Link
      href={`/writings/${post.slug}`}
      className="group mb-6 flex flex-col gap-4 rounded-[var(--radius-2xl)] border border-border p-7 transition-colors hover:border-foreground/35 sm:p-10"
    >
      <span className="mono text-meta uppercase tracking-wider text-brand-accent">
        {t("featured")}
      </span>
      <span
        lang={post.lang}
        className="max-w-3xl font-serif text-h1 font-medium tracking-[-0.015em] text-balance text-foreground"
      >
        {post.title}
      </span>
      {post.description && (
        <span
          lang={post.lang}
          className="max-w-2xl text-lead text-muted-foreground"
        >
          {post.description}
        </span>
      )}
      <span className="mono mt-2 flex flex-wrap items-center gap-3 text-caption text-muted-foreground">
        <time dateTime={post.date}>{dateLabel}</time>
        <span className="text-faint">·</span>
        {w("readingTime", { minutes: post.readingMinutes })}
        <Label className="uppercase">{post.lang}</Label>
        <ArrowRight className="ms-auto size-4 text-faint transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </span>
    </Link>
  );
}
