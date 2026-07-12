import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PostRow } from "@/components/writings/post-row";
import { Link } from "@/i18n/navigation";
import { getAllTags, getWritingsByTag } from "@/lib/writings";
import { alternatesFor } from "@/lib/seo";

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
  return {
    title: `${t("tagged")}: ${name}`,
    alternates: alternatesFor(`/writings/tag/${tag}`),
  };
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
    <Container className="pt-28 pb-16 sm:pt-32">
      <Link
        href="/writings"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 rtl:rotate-180" />
        {t("backToList")}
      </Link>

      <header className="mt-6 mb-10 flex flex-col gap-3">
        <span className="mono text-[13px] text-faint">
          {t("tagged")} · {posts.length}
        </span>
        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-medium tracking-[-0.03em]">
          {name}
        </h1>
      </header>

      <div className="border-t border-border">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
