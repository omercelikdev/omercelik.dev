import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";

/** Confident call-to-action band shown before the footer. */
export async function CtaBand() {
  const t = await getTranslations("cta");

  return (
    <Container className="pt-16">
      <Reveal className="flex flex-col items-start gap-6 rounded-[var(--radius-2xl)] border border-border p-10 sm:p-14">
        <h2 className="max-w-2xl text-h1 font-medium">{t("title")}</h2>
        <p className="max-w-xl text-body text-muted-foreground">
          {t("subtitle")}
        </p>
        <Link href="/contact" className={buttonClass("primary")}>
          {t("button")}
          <ArrowRight className="size-4" />
        </Link>
      </Reveal>
    </Container>
  );
}
