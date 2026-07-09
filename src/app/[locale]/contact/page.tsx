import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/contact/contact-form";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { site } from "@/config/site";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const links = [
    { href: site.links.email, label: site.email, Icon: Mail },
    { href: site.links.github, label: "GitHub", Icon: GithubIcon },
    { href: site.links.x, label: "X", Icon: XIcon },
    { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  ];

  return (
    <Container className="pt-28 pb-24 sm:pt-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
        <div className="max-w-xl">
          <header className="mb-10 flex flex-col gap-3">
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-medium tracking-[-0.03em]">
              {t("title")}
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </header>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-4 lg:pt-2">
          <span className="mono text-[11px] uppercase tracking-wider text-faint">
            {t("orReach")}
          </span>
          <div className="flex flex-col">
            {links.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer noopener"
                className="group flex items-center gap-3 border-b border-border py-3.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4 text-faint transition-colors group-hover:text-foreground" />
                {label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </Container>
  );
}
