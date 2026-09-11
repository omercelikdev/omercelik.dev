import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Clock, Layers } from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { PAGE_PADDING } from "@/components/ui/page-header";
import { Label, TagLink } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { mdxComponents } from "@/components/writings/mdx-components";
import { Comments } from "@/components/writings/comments";
import { Toc } from "@/components/writings/toc";
import { AuthorCard } from "@/components/writings/author-card";
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);
  if (!post) return {};
  // Both UI languages render this article; the copy in the language it was
  // written in is the canonical one (see articleMetadata).
  return articleMetadata(post);
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("writings");
  const post = await getWritingBySlug(slug);
  if (!post) notFound();

  const dateLabel = new Intl.DateTimeFormat(locale, {
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

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: { light: "github-light", dark: "github-dark" },
              keepBackground: false,
              // Fences without a language still get the block treatment.
              defaultLang: "plaintext",
            },
          ],
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["heading-anchor"],
                ariaHidden: true,
                tabIndex: -1,
              },
              content: { type: "text", value: "#" },
            },
          ],
        ],
      },
    },
  });

  return (
    // Wider than the site's 1080px column: the reading column sits centred in
    // the middle track, the table of contents in the right-hand margin.
    <div
      className={`mx-auto w-full max-w-[1280px] px-5 sm:px-7 ${PAGE_PADDING}`}
    >
      <div className="reading-progress" aria-hidden />
      <JsonLd data={articleJsonLd(post)} />

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,42rem)_minmax(0,1fr)] xl:gap-x-12">
        <article className="mx-auto min-w-0 max-w-2xl xl:col-start-2 xl:mx-0 xl:max-w-none">
          <Link
            href="/writings"
            className="inline-flex items-center gap-1.5 text-ui font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {t("backToList")}
          </Link>

          <header className="intro mt-6 flex flex-col gap-4 border-b border-border pb-8">
            <h1 className="font-serif text-h1 font-medium tracking-[-0.015em] text-balance">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-lead text-muted-foreground">
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
                  <li
                    key={p.slug}
                    className="flex items-baseline gap-2.5 text-ui"
                  >
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
            <details className="mt-8 rounded-[var(--radius-xl)] border border-border px-5 py-4 xl:hidden">
              <summary className="mono cursor-pointer text-meta uppercase tracking-wider text-faint">
                {t("toc")}
              </summary>
              <Toc headings={headings} label={t("toc")} className="mt-4" />
            </details>
          )}

          <div dir="auto" className="mt-2">
            {content}
          </div>

          <AuthorCard />
          <PostNav newer={adjacent.newer} older={adjacent.older} />
          <Comments term={slug} lang={locale} />
        </article>

        {showToc && (
          <aside className="hidden xl:col-start-3 xl:block">
            <div className="sticky top-24 max-w-56">
              <p className="mono mb-3 text-meta uppercase tracking-wider text-faint">
                {t("toc")}
              </p>
              <Toc headings={headings} label={t("toc")} />
            </div>
          </aside>
        )}
      </div>
    </div>
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
          <span className="text-ui font-medium text-foreground">
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
          <span className="text-ui font-medium text-foreground">
            {newer.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
