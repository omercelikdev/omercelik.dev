import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { Typewriter } from "@/components/motion/typewriter";
import { HeroStack } from "@/components/home/hero-stack";
import { profile } from "@/config/profile";
import { site } from "@/config/site";

/** Top to bottom: "I build" and what (typed), the explanation on one line,
 *  the actions, then the golden path — the stack on the left, its layers
 *  listed and explained on the right. */
export async function Hero() {
  const t = await getTranslations("home");
  const phrases = t.raw("phrases") as string[];
  const lead = t("headlineLead");
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <Container className="pt-12 pb-6 sm:pt-16">
        <div className="intro flex items-center gap-3">
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
            <span className="text-muted-foreground">{profile.headline}</span>
          </p>
        </div>

        {/* The full sentence is in the HTML (crawlers, no-JS); the sizer holds
            the longest phrase's box so typing never moves the layout. */}
        <h1 className="intro mt-7 text-display font-medium [animation-delay:70ms]">
          {lead}{" "}
          <span
            data-sizer={longest}
            className="inline-grid before:invisible before:col-start-1 before:row-start-1 before:content-[attr(data-sizer)]"
          >
            <span className="col-start-1 row-start-1">
              <Typewriter phrases={phrases} />
            </span>
          </span>
        </h1>

        <div className="mt-6 flex flex-col gap-7">
          <p className="intro text-lead text-muted-foreground [animation-delay:140ms]">
            {t("subtitle")}
          </p>
          <div className="intro flex flex-wrap items-center gap-3 [animation-delay:210ms]">
            <Link href="/work" className={buttonClass("primary")}>
              {t("ctaWork")}
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/writings" className={buttonClass("outline")}>
              {t("ctaWritings")}
            </Link>
          </div>
          <div className="intro mt-2 [animation-delay:280ms]">
            <HeroStack />
          </div>
        </div>
      </Container>
    </section>
  );
}
