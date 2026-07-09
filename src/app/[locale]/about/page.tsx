import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Portrait } from "@/components/about/portrait";
import { buttonClass } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const nav = await getTranslations("nav");

  return (
    <Container className="pt-28 pb-24 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div className="lg:pt-1">
          <Portrait alt={t("photoAlt")} />
        </div>

        <div className="max-w-2xl">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-medium tracking-[-0.03em]">
            {t("title")}
          </h1>
          <p className="mt-4 text-[15px] leading-8 text-foreground/90">
            {t("body")}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClass("primary")}>
              {nav("contact")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
            <Link href="/products" className={buttonClass("outline")}>
              {nav("products")}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
