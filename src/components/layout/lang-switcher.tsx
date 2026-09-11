"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, getPathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};

/** Two locales, so a toggle beats a menu: one link to the same page in the
 *  other language. A plain anchor on purpose — the full page load renders the
 *  root layout (theme script included) on the server instead of patching it
 *  on the client, which is what React 19 warns about. */
export function LangSwitcher() {
  const t = useTranslations("lang");
  const active = useLocale() as Locale;
  const pathname = usePathname();
  const other = locales.find((locale) => locale !== active) ?? active;
  const label = t("switchTo", { language: NATIVE_NAMES[other] });

  return (
    <a
      href={getPathname({ href: pathname, locale: other })}
      hrefLang={other}
      aria-label={label}
      title={label}
      className="flex h-9 items-center gap-1.5 rounded-[var(--radius-lg)] border border-border bg-background px-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Languages className="size-4" strokeWidth={2} />
      <span className="text-caption font-semibold uppercase">{other}</span>
    </a>
  );
}
