import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/section";
import { buttonClass } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Typewriter } from "@/components/motion/typewriter";

export async function Hero() {
  const t = await getTranslations("home");
  const roles = t.raw("roles") as string[];

  return (
    <Container className="pt-28 pb-16 sm:pt-36">
      <div className="reveal in flex max-w-3xl flex-col gap-6">
        <Eyebrow>{t("eyebrow")}</Eyebrow>

        <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.03] tracking-[-0.035em]">
          {t("headlineLead")}{" "}
          <Typewriter phrases={roles} />
        </h1>

        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link href="/contact" className={buttonClass("primary")}>
            {t("ctaContact")}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
          <Link href="/writings" className={buttonClass("ghost")}>
            {t("ctaWritings")}
          </Link>
        </div>
      </div>
    </Container>
  );
}
