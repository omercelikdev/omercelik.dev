import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Rss } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { WritingsList } from "@/components/writings/writings-list";
import { NewsletterBox } from "@/components/writings/newsletter-box";
import { getAllTags, getAllWritings } from "@/lib/writings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("writings");
  return pageMetadata({
    path: "/writings",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function WritingsPage() {
  const t = await getTranslations("writings");
  const [posts, tags] = await Promise.all([getAllWritings(), getAllTags()]);

  return (
    <Container className={PAGE_PADDING} narrow>
      <PageHeader title={t("title")} subtitle={t("subtitle")}>
        <a
          href="/feed.xml"
          className="mono inline-flex w-fit items-center gap-1.5 text-caption text-muted-foreground transition-colors hover:text-foreground"
        >
          <Rss className="size-3.5" />
          {t("rss")}
        </a>
      </PageHeader>

      {posts.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-ui text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <WritingsList
          posts={posts}
          tags={tags}
          allLabel={t("all")}
          filterLabel={t("filterLabel")}
        />
      )}
      <NewsletterBox />
    </Container>
  );
}
