import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { LabsGrid } from "@/components/labs/labs-grid";
import { getAllLabs } from "@/lib/labs";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("labs");
  return pageMetadata({
    path: "/labs",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function LabsPage() {
  const t = await getTranslations("labs");
  const labs = await getAllLabs();

  return (
    <Container className={PAGE_PADDING} narrow>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {labs.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-ui text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <LabsGrid
          labs={labs}
          allLabel={t("all")}
          filterLabel={t("filterLabel")}
        />
      )}
    </Container>
  );
}
