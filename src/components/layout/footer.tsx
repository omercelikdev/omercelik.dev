import { useTranslations } from "next-intl";
import { Mail, Rss } from "lucide-react";
import { Container } from "./container";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { site } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const socials = [
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
    { href: site.links.email, label: "Email", Icon: Mail, external: false },
    { href: "/feed.xml", label: t("rss"), Icon: Rss, external: false },
  ];

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="py-12">
        <div className="flex flex-col gap-3">
          <span className="mono text-body">
            omercelik<span className="text-brand-accent">.dev</span>
          </span>
          <p className="max-w-xs text-ui text-muted-foreground">
            {t("tagline")}
          </p>
          <a
            href={site.links.email}
            className="mono w-fit text-ui text-muted-foreground underline decoration-1 decoration-border underline-offset-[5px] transition-colors hover:text-foreground hover:decoration-foreground"
          >
            {site.email}
          </a>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-dashed border-border/60 pt-6">
          <span className="mono text-caption text-muted-foreground">
            © {year} {site.name}
          </span>
          <div className="flex items-center gap-1">
            {socials.map(({ href, label, Icon, external }) => (
              <a
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
                aria-label={label}
                title={label}
                className="grid size-9 place-items-center rounded-[var(--radius-lg)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
