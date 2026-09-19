import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonClass } from "@/components/ui/button";
import { Counter } from "@/components/motion/counter";
import { HeroStack } from "@/components/home/hero-stack";
import { profile } from "@/config/profile";
import { site } from "@/config/site";

const showTodo = process.env.NODE_ENV !== "production";

/** The thesis, three facts that back it, and the stack. One page-load
 *  entrance (`.intro`, staggered); nothing else moves on its own. */
export async function Hero() {
  const t = await getTranslations("home");
  const facts = profile.facts.filter((f) => showTodo || !f.todo);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <Container className="pt-12 pb-6 sm:pt-16">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-10">
          <div className="flex flex-col gap-6">
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
                <span className="text-muted-foreground">
                  {profile.headline}
                </span>
              </p>
            </div>

            <h1 className="intro text-display font-medium text-balance [animation-delay:70ms]">
              {t("thesis")}
            </h1>

            <p className="intro max-w-xl text-lead text-muted-foreground [animation-delay:140ms]">
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

            <dl className="intro grid grid-cols-3 gap-2.5 [animation-delay:280ms] max-sm:grid-cols-1">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex min-h-[88px] flex-col justify-end gap-1 rounded-[var(--radius-lg)] border border-border p-3.5 transition-colors hover:border-foreground"
                >
                  <dd className="text-h2 font-medium tabular-nums text-foreground">
                    {fact.countTo !== undefined ? (
                      <Counter to={fact.countTo} suffix={fact.suffix} />
                    ) : (
                      fact.value
                    )}
                  </dd>
                  <dt className="text-caption text-muted-foreground">
                    {fact.label}
                    {fact.todo && (
                      <span className="mono ms-1 text-faint">· todo</span>
                    )}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="intro [animation-delay:200ms]">
            <HeroStack />
          </div>
        </div>
      </Container>
    </section>
  );
}
