import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Container } from "./container";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { site } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const socials = [
    { href: site.links.github, label: "GitHub", Icon: GithubIcon },
    { href: site.links.x, label: "X", Icon: XIcon },
    { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: site.links.email, label: "Email", Icon: Mail },
  ];

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-foreground">
            {site.name}
          </span>
          <span className="text-xs text-muted-foreground">{t("tagline")}</span>
        </div>

        <div className="flex items-center gap-1">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="grid size-9 place-items-center rounded-[var(--radius-lg)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </Container>
      <Container className="flex flex-col gap-1 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} {site.name}. {t("rights")}
        </span>
        <span className="mono">{t("builtWith")}</span>
      </Container>
    </footer>
  );
}
