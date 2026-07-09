import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "./container";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { site } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  const socials = [
    { href: site.links.github, label: "GitHub", Icon: GithubIcon },
    { href: site.links.x, label: "X", Icon: XIcon },
    { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: site.links.email, label: "Email", Icon: Mail },
  ];

  const pages = [
    { href: "/products", key: "products" },
    { href: "/writings", key: "writings" },
    { href: "/about", key: "about" },
    { href: "/contact", key: "contact" },
  ] as const;

  return (
    <footer className="mt-32 border-t border-border">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="mono text-[14px]">
            omercelik<span className="text-brand-accent">.dev</span>
          </span>
          <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
          <a
            href={site.links.email}
            className="mono w-fit text-[13px] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            {site.email}
          </a>
        </div>

        <nav className="flex flex-col gap-2.5 sm:items-end">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {nav(p.key)}
            </Link>
          ))}
        </nav>
      </Container>

      <Container className="flex items-center justify-between gap-4 border-t border-border py-6">
        <span className="mono text-[12px] text-muted-foreground">
          © {year} {site.name}
        </span>
        <div className="flex items-center gap-1">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer noopener"
              aria-label={label}
              className="grid size-9 place-items-center rounded-[var(--radius-lg)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
