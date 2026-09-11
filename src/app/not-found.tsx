import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  // Replaces the layout's "index, follow", which would contradict the
  // noindex Next adds to the 404 by itself.
  return { title: t("title"), robots: { index: false, follow: true } };
}

/** Unknown paths. The static export writes this as out/404.html, which the
 *  host serves for anything it can't find. */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <span className="mono text-display font-medium text-faint">404</span>
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 font-medium">{t("title")}</h1>
        <p className="max-w-sm text-ui text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>
      <LinkButton href="/" variant="primary">
        {t("home")}
      </LinkButton>
    </Container>
  );
}
