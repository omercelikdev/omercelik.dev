import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/section";
import { buttonClass } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Typewriter } from "@/components/motion/typewriter";

const H1 =
  "text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.05] tracking-[-0.035em]";

export async function Hero() {
  const t = await getTranslations("home");
  const roles = t.raw("roles") as string[];
  const lead = t("headlineLead");
  // Reserve the tallest possible height so the typewriter never shifts the page.
  const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <Container className="pt-28 pb-16 sm:pt-36">
      <div className="reveal in flex max-w-3xl flex-col gap-6">
        <Eyebrow>{t("eyebrow")}</Eyebrow>

        <div className="relative">
          {/* invisible sizer: locks the block height to the longest phrase */}
          <h1 aria-hidden className={`${H1} invisible`}>
            {lead} {longest}.
          </h1>
          {/* visible animated headline, overlaid on the sizer */}
          <h1 className={`${H1} absolute inset-0`}>
            {lead} <Typewriter phrases={roles} />
          </h1>
        </div>

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
