"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
  de: "Deutsch",
  fr: "Français",
  zh: "中文",
  ja: "日本語",
};

export function LangSwitcher() {
  const t = useTranslations("lang");
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function select(locale: Locale) {
    setOpen(false);
    if (locale === activeLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("label")}
        aria-haspopup="menu"
        aria-expanded={open}
        data-pending={isPending || undefined}
        className="flex h-9 items-center gap-1.5 rounded-[var(--radius-lg)] border border-border bg-background px-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[pending]:opacity-60"
      >
        <Languages className="size-4" strokeWidth={2} />
        <span className="text-xs font-semibold uppercase">{activeLocale}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 min-w-40 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background p-1 shadow-[var(--shadow-overlay)]"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              role="menuitemradio"
              aria-checked={locale === activeLocale}
              onClick={() => select(locale)}
              className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2 text-start text-[13px] text-foreground transition-colors hover:bg-muted"
            >
              <span>{NATIVE_NAMES[locale]}</span>
              {locale === activeLocale && (
                <Check className="size-3.5 text-violet" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
