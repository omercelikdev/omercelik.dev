import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ArrowUpRight, Mail, Rss } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Portrait } from "@/components/about/portrait";
import { PAGE_PADDING } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { Link } from "@/i18n/navigation";
import { getFeaturedProducts } from "@/lib/github";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, profileJsonLd } from "@/lib/seo";
import { site } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const SUBHEAD =
  "mono mb-4 border-b border-border pb-3 text-ui font-normal text-muted-foreground";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const nav = await getTranslations("nav");
  const footer = await getTranslations("footer");
  const body = t.raw("body") as string[];
  const toolbox = t.raw("toolbox") as string[];
  // "Working on" is the featured product list — the same source as the home
  // page, so it can never drift from what's actually shipped.
  const products = await getFeaturedProducts();

  const elsewhere = [
    { href: site.links.github, label: "GitHub", Icon: GithubIcon, external: true },
    { href: site.links.x, label: "X", Icon: XIcon, external: true },
    { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    { href: site.links.email, label: site.email, Icon: Mail, external: false },
    { href: "/feed.xml", label: footer("rss"), Icon: Rss, external: false },
  ];

  return (
    <Container className={PAGE_PADDING}>
      <JsonLd data={profileJsonLd(locale)} />
      <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="intro flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <Portrait alt={t("photoAlt")} />
          <div>
            <h2 className="mono mb-2 text-meta uppercase tracking-wider text-faint">
              {t("elsewhereTitle")}
            </h2>
            <ul className="flex flex-col">
              {elsewhere.map(({ href, label, Icon, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    className="group flex items-center gap-3 border-b border-border py-2.5 text-ui text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4 text-faint transition-colors group-hover:text-foreground" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="intro max-w-2xl [animation-delay:80ms]">
          <h1 className="text-h1 font-medium">{t("title")}</h1>
          <div className="mt-6 flex flex-col gap-5">
            {body.map((paragraph) => (
              <p key={paragraph} className="text-lead text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>

          {products.length > 0 && (
            <section className="mt-14">
              <h2 className={SUBHEAD}>{t("nowTitle")}</h2>
              <ul>
                {products.map((product) => (
                  <li key={product.fullName}>
                    <a
                      href={product.homepage ?? product.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-start justify-between gap-6 border-b border-border py-4"
                    >
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="text-body font-medium text-foreground">
                          {product.name}
                        </span>
                        {product.description && (
                          <span className="text-ui text-muted-foreground">
                            {product.description}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight className="mt-1 size-4 flex-none text-faint transition-colors group-hover:text-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12">
            <h2 className={SUBHEAD}>{t("toolboxTitle")}</h2>
            <div className="flex flex-wrap gap-1.5">
              {toolbox.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </section>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClass("primary")}>
              {nav("contact")}
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/writings" className={buttonClass("outline")}>
              {nav("writings")}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
