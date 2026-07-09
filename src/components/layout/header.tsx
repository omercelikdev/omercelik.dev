"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "./container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LangSwitcher } from "./lang-switcher";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/config/site";

const NAV = [
  { href: "/products", key: "products" },
  { href: "/writings", key: "writings" },
  { href: "/about", key: "about" },
] as const;

/** Brand wordmark: name over the domain, with an accented ".dev". */
function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="text-[13px] font-semibold tracking-tight">
        {site.name}
      </span>
      <span className="mono mt-1 text-[11px] text-muted-foreground">
        omercelik<span className="text-brand-accent">.dev</span>
      </span>
    </span>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color] duration-300 ${
        scrolled
          ? "border-b border-border bg-[color-mix(in_oklch,var(--surface)_72%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-15 items-center gap-4 py-3.5">
        <Link href="/" aria-label={site.name} className="flex-none">
          <Wordmark />
        </Link>

        <nav className="ms-6 hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[13px] transition-colors ${
                isActive(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <Link href="/contact" className={`${buttonClass("outline", "sm")} hidden sm:inline-flex`}>
            {t("contact")}
          </Link>
          <LangSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid size-9 place-items-center rounded-[var(--radius-lg)] border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-border bg-surface md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {[...NAV, { href: "/contact", key: "contact" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors ${
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
