import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Clock, Layers } from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { Container } from "@/components/layout/container";
import { Chip, TagLink } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { mdxComponents } from "@/components/writings/mdx-components";
import { Comments } from "@/components/writings/comments";
import { getSeriesPosts, getWritingBySlug, getWritingSlugs } from "@/lib/writings";
import { alternatesFor, localeUrl } from "@/lib/seo";
import { site } from "@/config/site";

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
  return {
    title: post.title,
    description: post.description,
    alternates: alternatesFor(`/writings/${slug}`),
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
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

  const seriesPosts = post.series ? await getSeriesPosts(post.series) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang,
    author: { "@type": "Person", name: site.name, url: site.url },
    publisher: { "@type": "Person", name: site.name },
    mainEntityOfPage: localeUrl(locale, `/writings/${slug}`),
  };

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
            },
          ],
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  return (
    <Container className="pt-28 pb-24 sm:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-2xl">
        <Link
          href="/writings"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          {t("backToList")}
        </Link>

        <header className="mt-6 flex flex-col gap-4 border-b border-border pb-8">
          <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] font-medium tracking-[-0.03em] text-balance">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          )}
          <div className="mono flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
            <time dateTime={post.date}>{dateLabel}</time>
            <span className="text-faint">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {t("readingTime", { minutes: post.readingMinutes })}
            </span>
            <Chip tone="neutral" className="uppercase">
              {post.lang}
            </Chip>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagLink key={tag} tag={tag} />
              ))}
            </div>
          )}
        </header>

        {/* Series navigator */}
        {post.series && seriesPosts.length > 1 && (
          <nav className="mt-8 rounded-[var(--radius-xl)] border border-border p-5">
            <div className="mono mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-faint">
              <Layers className="size-3.5" />
              {t("series")} · {post.series}
            </div>
            <ol className="flex flex-col gap-1.5">
              {seriesPosts.map((p, i) => (
                <li key={p.slug} className="flex items-baseline gap-2.5 text-[13px]">
                  <span className="mono text-faint">{i + 1}.</span>
                  {p.slug === post.slug ? (
                    <span className="font-medium text-foreground">{p.title}</span>
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

        <div dir="auto" className="mt-2">
          {content}
        </div>

        <Comments />
      </article>
    </Container>
  );
}
