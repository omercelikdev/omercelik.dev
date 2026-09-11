import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { PostRow } from "@/components/writings/post-row";
import { Link } from "@/i18n/navigation";
import { getAllTags, getWritingsByTag } from "@/lib/writings";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ slug }) => ({ tag: slug }));
}

async function tagName(slug: string): Promise<string | null> {
  const tags = await getAllTags();
  return tags.find((t) => t.slug === slug)?.tag ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag } = await params;
  const name = await tagName(tag);
  const t = await getTranslations({ locale, namespace: "writings" });
  if (!name) return {};
  // Tag pages are thin lists of posts that live elsewhere: out of the index,
  // but crawlable, so they still lead search engines to the articles.
  return pageMetadata({
    locale,
    path: `/writings/tag/${tag}`,
    title: `${t("tagged")}: ${name}`,
    description: t("subtitle"),
    noindex: true,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("writings");
  const name = await tagName(tag);
  if (!name) notFound();
  const posts = await getWritingsByTag(tag);

  return (
    <Container className={PAGE_PADDING}>
      <Link
        href="/writings"
        className="inline-flex items-center gap-1.5 text-ui font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t("backToList")}
      </Link>

      <div className="mt-6">
        <PageHeader
          eyebrow={
            <span className="mono text-ui text-faint">
              {t("tagged")} · {posts.length}
            </span>
          }
          title={name}
        />
      </div>

      <div className="border-t border-border">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
