import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
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
    alternates: alternatesFor("/writings"),
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
    <Container className="pt-28 pb-16 sm:pt-32">
      <header className="mb-8 flex flex-col gap-3">
        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-medium tracking-[-0.03em]">
          {t("title")}
        </h1>
        <p className="max-w-xl text-[15px] text-muted-foreground">
          {t("subtitle")}
        </p>
      </header>

      {tags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-1.5">
          {tags.map(({ tag }) => (
            <TagLink key={tag} tag={tag} />
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-sm text-muted-foreground">
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
