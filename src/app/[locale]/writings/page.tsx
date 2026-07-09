import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/section";
import { PostCard } from "@/components/writings/post-card";
import { getAllWritings } from "@/lib/writings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "writings" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function WritingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("writings");
  const posts = await getAllWritings();

  return (
    <Container className="py-16">
      <div className="mb-10 flex flex-col gap-3">
        <Eyebrow>Notes</Eyebrow>
        <h1 className="text-3xl font-extrabold tracking-[-0.02em]">
          {t("title")}
        </h1>
        <p className="max-w-prose text-[15px] text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-[var(--radius-2xl)] border border-border bg-background p-10 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
