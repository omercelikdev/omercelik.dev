"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "./container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LangSwitcher } from "./lang-switcher";
import { site } from "@/config/site";

const NAV = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/writings", key: "writings" },
  { href: "/about", key: "about" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] backdrop-blur-md">
      <Container className="flex h-16 items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
          <span className="grid size-8 place-items-center rounded-[var(--radius-md)] bg-primary text-[15px] font-extrabold text-primary-foreground">
            Ö
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[13px] font-semibold tracking-tight">
              {site.name}
            </span>
            <span className="mono text-[11px] text-muted-foreground">
              {site.domain}
            </span>
          </span>
        </Link>

        <nav className="ms-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[var(--radius-md)] px-3 py-1.5 text-[13px] font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <LangSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid size-9 place-items-center rounded-[var(--radius-lg)] border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-border bg-surface md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
