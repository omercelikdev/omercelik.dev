import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <span className="mono text-5xl font-extrabold text-faint">404</span>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>
      <LinkButton href="/" variant="primary">
        {t("home")}
      </LinkButton>
    </Container>
  );
}
