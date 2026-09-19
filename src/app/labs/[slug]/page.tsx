import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PAGE_PADDING } from "@/components/ui/page-header";
import { TagLink } from "@/components/ui/badge";
import { DemoFrame } from "@/components/labs/demo-frame";
import { renderMdx } from "@/lib/mdx";
import { getLabBySlug, getLabSlugs } from "@/lib/labs";
import { getWritingBySlug } from "@/lib/writings";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getLabSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);
  if (!lab) return {};
  return pageMetadata({
    path: `/labs/${slug}`,
    title: lab.title,
    description: lab.summary,
  });
}

/** A lab's own page: the demo open at the top, the notes under it, and the
 *  essay that explains it, if there is one. */
export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("labs");
  const lab = await getLabBySlug(slug);
  if (!lab) notFound();

  const [notes, writing] = await Promise.all([
    renderMdx(lab.content),
    lab.writing ? getWritingBySlug(lab.writing) : Promise.resolve(null),
  ]);

  return (
    <Container className={PAGE_PADDING}>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 text-ui font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t("backToList")}
        </Link>

        <header className="intro mt-6 flex flex-col gap-3">
          <h1 className="text-h1 font-medium text-balance">{lab.title}</h1>
          <p className="text-lead text-muted-foreground">{lab.summary}</p>
          {lab.tags && lab.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lab.tags.map((tag) => (
                <TagLink key={tag} tag={tag} />
              ))}
            </div>
          )}
        </header>

        <DemoFrame
          slug={lab.slug}
          title={lab.title}
          summary={lab.summary}
          open
        />

        <div className="max-w-2xl">{notes}</div>

        {writing && (
          <p className="mt-10 border-t border-border pt-6 text-ui text-muted-foreground">
            {t("readTheEssay")}{" "}
            <Link
              href={`/writings/${writing.slug}`}
              className="font-medium text-foreground underline decoration-border underline-offset-[5px] transition-colors hover:decoration-foreground"
            >
              {writing.title}
            </Link>
          </p>
        )}
      </div>
    </Container>
  );
}
