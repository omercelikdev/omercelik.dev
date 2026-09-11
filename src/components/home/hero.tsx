import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Typewriter } from "@/components/motion/typewriter";
import { HeroStack } from "@/components/home/hero-stack";
import { site } from "@/config/site";

export async function Hero() {
  const t = await getTranslations("home");
  const roles = t.raw("roles") as string[];
  const lead = t("headlineLead");
  const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <section className="relative overflow-hidden">
      {/* Subtle hero backdrop: a fading dot grid on the plain background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <Container className="pt-12 pb-4 sm:pt-16">
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-8">
          <div className="intro flex flex-col gap-6">
            {/* Who: the person first, then what they build. */}
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/omer-160.jpg"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full border border-border object-cover grayscale"
              />
              <p className="text-ui leading-tight">
                <span className="block font-medium text-foreground">
                  {site.name}
                </span>
                <span className="text-muted-foreground">{t("role")}</span>
              </p>
            </div>

            {/* One headline. The rotating phrase is rendered in full on the
                server, so crawlers and no-JS visitors read a whole sentence.
                The ::before sizer holds the longest phrase's box, so typing
                never shifts the layout — and, being generated content, stays
                out of the heading's text. */}
            <h1 className="text-display font-medium">
              {lead}{" "}
              <span
                data-sizer={longest}
                className="inline-grid before:invisible before:col-start-1 before:row-start-1 before:content-[attr(data-sizer)]"
              >
                <span className="col-start-1 row-start-1">
                  <Typewriter phrases={roles} />
                </span>
              </span>
            </h1>

            <p className="max-w-xl text-lead text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/contact" className={buttonClass("primary")}>
                {t("ctaContact")}
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/writings" className={buttonClass("ghost")}>
                {t("ctaWritings")}
              </Link>
            </div>
          </div>

          {/* Signature: what the headline means, as a system you can open. */}
          <div className="intro [animation-delay:140ms]">
            <HeroStack />
          </div>
        </div>
      </Container>
    </section>
  );
}
