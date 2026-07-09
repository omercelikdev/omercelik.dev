import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";

/** Absolute URL for a logical path in a given locale, honouring the
 *  "as-needed" prefix (the default locale has no prefix). */
export function localeUrl(locale: string, path = "/"): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const clean = path === "/" ? "" : path;
  return `${site.url}${prefix}${clean}`;
}

/** hreflang + canonical block for a logical path, for every locale plus
 *  x-default. Feed this into a page's `alternates` metadata. */
export function alternatesFor(path = "/"): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localeUrl(locale, path);
  }
  languages["x-default"] = localeUrl(routing.defaultLocale, path);
  return {
    canonical: localeUrl(routing.defaultLocale, path),
    languages,
  };
}
