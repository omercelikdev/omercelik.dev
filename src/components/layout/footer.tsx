import { useTranslations } from "next-intl";
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
  ];

  const pages = [
    { href: "/products", key: "products" },
    { href: "/writings", key: "writings" },
    { href: "/about", key: "about" },
    { href: "/contact", key: "contact" },
  ] as const;

  return (
    <footer className="mt-32 border-t border-border">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="mono text-[13px]">
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

        <nav className="flex flex-col gap-2.5">
          <span className="mono text-[11px] uppercase tracking-wider text-faint">
            {t("pages")}
          </span>
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

        <nav className="flex flex-col gap-2.5">
          <span className="mono text-[11px] uppercase tracking-wider text-faint">
            {t("elsewhere")}
          </span>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <s.Icon className="size-3.5" />
              {s.label}
            </a>
          ))}
        </nav>
      </Container>

      <Container className="border-t border-border py-6 text-[12px] text-muted-foreground">
        <span className="mono">
          © {year} {site.name}
        </span>
      </Container>
    </footer>
  );
}
