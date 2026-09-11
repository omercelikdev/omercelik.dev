import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return pageMetadata({
    path: "/contact",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const links = [
    { href: site.links.email, label: site.email, Icon: Mail, external: false },
    {
      href: site.links.github,
      label: "GitHub",
      Icon: GithubIcon,
      external: true,
    },
    { href: site.links.x, label: "X", Icon: XIcon, external: true },
    {
      href: site.links.linkedin,
      label: "LinkedIn",
      Icon: LinkedinIcon,
      external: true,
    },
  ];

  return (
    <Container className={PAGE_PADDING}>
      <div className="grid gap-14 lg:grid-cols-[1fr_320px]">
        <div className="max-w-xl">
          <PageHeader title={t("title")} subtitle={t("subtitle")} />
          <ContactForm />
        </div>

        <aside className="intro flex flex-col gap-4 lg:pt-3">
          <span className="mono text-meta uppercase tracking-wider text-faint">
            {t("orReach")}
          </span>
          <div className="flex flex-col">
            {links.map(({ href, label, Icon, external }) => (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
                className="group flex items-center gap-3 border-b border-border py-3.5 text-ui text-muted-foreground transition-colors hover:text-foreground"
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
