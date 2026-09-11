import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Rss } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { PostRow } from "@/components/writings/post-row";
import { TagLink } from "@/components/ui/badge";
import { getAllTags, getAllWritings } from "@/lib/writings";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "writings" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor(locale, "/writings"),
  };
}

export default async function WritingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("writings");
  const [posts, tags] = await Promise.all([getAllWritings(), getAllTags()]);

  return (
    <Container className={PAGE_PADDING}>
      <PageHeader title={t("title")} subtitle={t("subtitle")}>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {tags.map(({ tag }) => (
            <TagLink key={tag} tag={tag} />
          ))}
          <a
            href="/feed.xml"
            className="mono ms-auto inline-flex items-center gap-1.5 text-caption text-muted-foreground transition-colors hover:text-foreground"
          >
            <Rss className="size-3.5" />
            {t("rss")}
          </a>
        </div>
      </PageHeader>

      {posts.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-ui text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="border-t border-border">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
