import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Download, Mail, Rss } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Portrait } from "@/components/about/portrait";
import { PAGE_PADDING } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, profileJsonLd } from "@/lib/seo";
import { profile } from "@/config/profile";
import { site } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return pageMetadata({
    path: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const SUBHEAD =
  "mb-4 border-b border-border pb-3 text-ui font-medium text-foreground";

const showTodo = process.env.NODE_ENV !== "production";

/** Who I am, in prose; then experience as one paragraph per role, and the
 *  toolbox. Links darken on hover and stay put. */
export default async function AboutPage() {
  const t = await getTranslations("about");
  const nav = await getTranslations("nav");
  const footer = await getTranslations("footer");
  const body = t.raw("body") as string[];
  const roles = profile.roles.filter((r) => showTodo || !r.todo);

  const elsewhere = [
    {
      href: site.links.github,
      label: "GitHub",
      Icon: GithubIcon,
      external: true,
    },
    {
      href: site.links.linkedin,
      label: "LinkedIn",
      Icon: LinkedinIcon,
      external: true,
    },
    { href: site.links.x, label: "X", Icon: XIcon, external: true },
    { href: site.links.email, label: site.email, Icon: Mail, external: false },
    { href: "/feed.xml", label: footer("rss"), Icon: Rss, external: false },
  ];

  return (
    <Container className={PAGE_PADDING}>
      <JsonLd data={profileJsonLd()} />
      <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="intro flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <Portrait alt={t("photoAlt")} />
          <div>
            <h2 className="mono mb-1 text-caption text-faint">
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
          {profile.cvUrl && (
            <a href={profile.cvUrl} className={buttonClass("outline")}>
              <Download className="size-4" />
              {t("downloadCv")}
            </a>
          )}
        </aside>

        <div className="intro max-w-2xl [animation-delay:80ms]">
          <h1 className="text-h1 font-medium">{t("title")}</h1>
          <div className="mt-6 flex flex-col gap-5">
            {body.map((paragraph, i) => (
              <p
                key={paragraph}
                className={`text-lead ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <section className="mt-14">
            <h2 className={SUBHEAD}>{t("experienceTitle")}</h2>
            <div>
              {roles.map((role) => (
                <div
                  key={role.title + role.org}
                  className="grid gap-2 border-b border-border py-5 sm:grid-cols-[120px_1fr] sm:gap-6"
                >
                  <span className="mono pt-1 text-caption text-faint">
                    {role.from} — {role.to}
                  </span>
                  <div>
                    <p className="text-body font-medium text-foreground">
                      {role.title} · {role.org}
                      {role.todo && (
                        <span className="mono ms-2 text-caption text-faint">
                          todo
                        </span>
                      )}
                    </p>
                    <p className="text-caption text-faint">{role.context}</p>
                    <p className="mt-2 text-ui text-muted-foreground">
                      {role.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className={SUBHEAD}>{t("toolboxTitle")}</h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.toolbox.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </section>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonClass("primary")}>
              {nav("contact")}
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/work" className={buttonClass("outline")}>
              {nav("work")}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
