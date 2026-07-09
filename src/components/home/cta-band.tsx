import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";

/** Confident call-to-action band shown before the footer. */
export async function CtaBand() {
  const t = await getTranslations("cta");

  return (
    <Container className="py-24">
      <Reveal className="flex flex-col items-start gap-6 rounded-[var(--radius-2xl)] border border-border p-10 sm:p-14">
        <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em]">
          {t("title")}
        </h2>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>
        <Link href="/contact" className={buttonClass("primary")}>
          {t("button")}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </Reveal>
    </Container>
  );
}
