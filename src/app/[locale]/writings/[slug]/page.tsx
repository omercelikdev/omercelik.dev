import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Clock } from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { Container } from "@/components/layout/container";
import { Chip, Tag } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { mdxComponents } from "@/components/writings/mdx-components";
import { getWritingBySlug, getWritingSlugs } from "@/lib/writings";

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
    <Container className="py-16">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/writings"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          {t("backToList")}
        </Link>

        <header className="mt-6 flex flex-col gap-4 border-b border-border pb-8">
          <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-balance">
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
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </header>

        <div dir="auto" className="mt-2">
          {content}
        </div>
      </article>
    </Container>
  );
}
