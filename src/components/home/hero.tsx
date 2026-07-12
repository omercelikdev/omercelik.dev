import { getTranslations } from "next-intl/server";
import { ArrowRight, Braces, FileCheck2, Sparkles, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Typewriter } from "@/components/motion/typewriter";
import { SpecCard } from "@/components/home/hero-spec";

const H1 =
  "text-[clamp(2.4rem,6vw,4.2rem)] font-medium leading-[1.05] tracking-[-0.035em]";

const EYEBROW_ICONS: LucideIcon[] = [Sparkles, FileCheck2, Braces];

export async function Hero() {
  const t = await getTranslations("home");
  const roles = t.raw("roles") as string[];
  const lead = t("headlineLead");
  const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), "");
  // Split the translated "A · B · .NET" eyebrow into individual chips.
  const chips = t("eyebrow")
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="relative overflow-hidden">
      {/* Subtle hero backdrop: a fading dot grid on the plain background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <Container className="pt-28 pb-16 sm:pt-36">
        <div className="reveal in flex max-w-3xl flex-col gap-6">
          {/* Eyebrow: live dot + labelled chips */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-accent" />
            </span>
            {chips.map((label, i) => {
              const Icon = EYEBROW_ICONS[i] ?? Sparkles;
              return (
                <span
                  key={label}
                  className="mono inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <Icon className="size-3.5" strokeWidth={2} />
                  {label}
                </span>
              );
            })}
          </div>

          <div className="relative">
            <h1 aria-hidden className={`${H1} invisible`}>
              {lead} {longest}.
            </h1>
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

          {/* Signature: a golden-path spec manifest */}
          <SpecCard />
        </div>
      </Container>
    </section>
  );
}
