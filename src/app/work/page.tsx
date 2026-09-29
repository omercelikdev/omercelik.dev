import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { WorkCard } from "@/components/work/work-card";
import { QorpeBand } from "@/components/home/qorpe-band";
import { OpenSource } from "@/components/products/open-source";
import { getAllWork } from "@/lib/work";
import { THEMES } from "@/config/themes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("work");
  return pageMetadata({
    path: "/work",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function WorkPage() {
  const t = await getTranslations("work");
  const work = await getAllWork();
  // Each case is listed once, under its first theme; empty themes are hidden.
  const sections = THEMES.map((theme) => ({
    ...theme,
    items: work.filter((w) => w.themes[0] === theme.slug),
  })).filter((s) => s.items.length > 0);

  return (
    <Container className={PAGE_PADDING}>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {work.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-ui text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-14">
          {sections.map((section) => (
            <section
              key={section.slug}
              id={section.slug}
              aria-labelledby={`${section.slug}-title`}
              className="scroll-mt-24"
            >
              <div className="mb-5 flex flex-col gap-1 border-b border-border pb-3">
                <h2
                  id={`${section.slug}-title`}
                  className="text-h3 font-medium"
                >
                  {section.title}
                </h2>
                <p className="text-ui text-muted-foreground">
                  {section.summary}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.items.map((item) => (
                  <WorkCard key={item.slug} work={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      <div className="mt-16 flex flex-col gap-10">
        <QorpeBand />
        <OpenSource />
      </div>
    </Container>
  );
}
