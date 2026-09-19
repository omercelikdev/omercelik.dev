import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { WorkGrid } from "@/components/work/work-grid";
import { QorpeBand } from "@/components/home/qorpe-band";
import { getAllWork } from "@/lib/work";
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

  return (
    <Container className={PAGE_PADDING}>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {work.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-ui text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <WorkGrid
          work={work}
          allLabel={t("all")}
          filterLabel={t("filterLabel")}
        />
      )}
      <div className="mt-16">
        <QorpeBand />
      </div>
    </Container>
  );
}
