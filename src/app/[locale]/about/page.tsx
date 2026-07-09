import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/section";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { site } from "@/config/site";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const contacts = [
    { href: site.links.github, label: "GitHub", handle: "@" + site.githubUsername, Icon: GithubIcon },
    { href: site.links.x, label: "X", handle: "@" + site.githubUsername, Icon: XIcon },
    { href: site.links.linkedin, label: "LinkedIn", handle: site.name, Icon: LinkedinIcon },
    { href: site.links.email, label: "Email", handle: site.email, Icon: Mail },
  ];

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-3">
          <Eyebrow>{site.domain}</Eyebrow>
          <h1 className="text-3xl font-extrabold tracking-[-0.02em]">
            {t("title")}
          </h1>
        </div>

        <p className="mt-6 text-[15px] leading-7 text-foreground/90">
          {t("body")}
        </p>

        <div className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">
            {t("contactTitle")}
          </h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            {t("contactSubtitle")}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {contacts.map(({ href, label, handle, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-background p-4 shadow-[var(--shadow-surface)] transition-all hover:border-border-strong"
              >
                <span className="grid size-9 place-items-center rounded-[var(--radius-lg)] bg-muted text-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-semibold">{label}</span>
                  <span className="mono text-[11px] text-muted-foreground">
                    {handle}
                  </span>
                </span>
                <ArrowUpRight className="ms-auto size-4 text-faint transition-colors group-hover:text-foreground" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
