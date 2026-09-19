import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, Clock, Layers } from "lucide-react";
import { RailSection, ReadingShell } from "@/components/layout/reading-shell";
import { Label, TagLink } from "@/components/ui/badge";
import { Comments } from "@/components/writings/comments";
import { Toc } from "@/components/writings/toc";
import { AuthorCard } from "@/components/writings/author-card";
import { NewsletterBox } from "@/components/writings/newsletter-box";
import { renderMdx } from "@/lib/mdx";
import { JsonLd } from "@/components/seo/json-ld";
import {
  extractHeadings,
  getAdjacentWritings,
  getSeriesPosts,
  getWritingBySlug,
  getWritingSlugs,
  type WritingMeta,
} from "@/lib/writings";
import { articleJsonLd, articleMetadata } from "@/lib/seo";

/** A table of contents earns its space from three sections up. */
const TOC_MIN_HEADINGS = 3;

export async function generateStaticParams() {
  const slugs = await getWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);
  if (!post) return {};
  return articleMetadata(post);
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("writings");
  const post = await getWritingBySlug(slug);
  if (!post) notFound();

  const dateLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.date));

  const [seriesPosts, adjacent] = await Promise.all([
    post.series ? getSeriesPosts(post.series) : Promise.resolve([]),
    getAdjacentWritings(slug),
  ]);
  const headings = extractHeadings(post.content);
  const showToc = headings.length >= TOC_MIN_HEADINGS;

  const content = await renderMdx(post.content);

  return (
    <ReadingShell
      before={
        <>
          <div className="reading-progress" aria-hidden />
          <JsonLd data={articleJsonLd(post)} />
        </>
      }
      aside={
        showToc ? (
          <RailSection title={t("toc")}>
            <Toc headings={headings} label={t("toc")} />
          </RailSection>
        ) : undefined
      }
    >
      <Link
        href="/writings"
        className="inline-flex items-center gap-1.5 text-ui font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t("backToList")}
      </Link>

      <header className="intro mt-6 flex flex-col gap-4 border-b border-border pb-8">
        {/* The interface is English; the piece is in its own language. */}
        <h1
          lang={post.lang}
          className="font-serif text-h1 font-medium tracking-[-0.015em] text-balance"
        >
          {post.title}
        </h1>
        {post.description && (
          <p lang={post.lang} className="text-lead text-muted-foreground">
            {post.description}
          </p>
        )}
        <div className="mono flex flex-wrap items-center gap-3 text-caption text-muted-foreground">
          <time dateTime={post.date}>{dateLabel}</time>
          <span className="text-faint">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {t("readingTime", { minutes: post.readingMinutes })}
          </span>
          <Label className="uppercase">{post.lang}</Label>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagLink key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>

      {post.series && seriesPosts.length > 1 && (
        <nav className="mt-8 rounded-[var(--radius-xl)] border border-border p-5">
          <div className="mono mb-3 flex items-center gap-2 text-meta uppercase tracking-wider text-faint">
            <Layers className="size-3.5" aria-hidden />
            {t("series")} · {post.series}
          </div>
          <ol className="flex flex-col gap-1.5">
            {seriesPosts.map((p, i) => (
              <li key={p.slug} className="flex items-baseline gap-2.5 text-ui">
                <span className="mono text-faint">{i + 1}.</span>
                {p.slug === post.slug ? (
                  <span
                    aria-current="page"
                    className="font-medium text-foreground"
                  >
                    {p.title}
                  </span>
                ) : (
                  <Link
                    href={`/writings/${p.slug}`}
                    className="text-muted-foreground decoration-1 underline-offset-[5px] transition-colors hover:text-foreground hover:underline"
                  >
                    {p.title}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {showToc && (
        <details className="mt-8 rounded-[var(--radius-xl)] border border-border px-5 py-4 lg:hidden">
          <summary className="mono cursor-pointer text-meta uppercase tracking-wider text-faint">
            {t("toc")}
          </summary>
          <Toc headings={headings} label={t("toc")} className="mt-4" />
        </details>
      )}

      <div lang={post.lang} dir="auto" className="mt-2">
        {content}
      </div>

      <AuthorCard />
      <NewsletterBox />
      <PostNav newer={adjacent.newer} older={adjacent.older} />
      <Comments term={slug} lang="en" />
    </ReadingShell>
  );
}

async function PostNav({
  newer,
  older,
}: {
  newer: WritingMeta | null;
  older: WritingMeta | null;
}) {
  if (!newer && !older) return null;
  const t = await getTranslations("writings");
  const card =
    "group flex flex-col gap-1.5 rounded-[var(--radius-xl)] border border-border p-4 transition-colors hover:border-foreground/35";

  return (
    <nav className="mt-6 grid gap-3 sm:grid-cols-2">
      {older ? (
        <Link href={`/writings/${older.slug}`} className={card}>
          <span className="mono inline-flex items-center gap-1 text-meta uppercase tracking-wider text-faint">
            <ArrowLeft className="size-3" aria-hidden />
            {t("older")}
          </span>
          <span
            lang={older.lang}
            className="text-ui font-medium text-foreground"
          >
            {older.title}
          </span>
        </Link>
      ) : (
        <span className="max-sm:hidden" />
      )}
      {newer && (
        <Link
          href={`/writings/${newer.slug}`}
          className={`${card} sm:items-end sm:text-end`}
        >
          <span className="mono inline-flex items-center gap-1 text-meta uppercase tracking-wider text-faint">
            {t("newer")}
            <ArrowRight className="size-3" aria-hidden />
          </span>
          <span
            lang={newer.lang}
            className="text-ui font-medium text-foreground"
          >
            {newer.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
