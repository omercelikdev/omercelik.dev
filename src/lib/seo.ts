import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";

/** Absolute URL for a logical path in a locale: ("tr", "/about") →
 *  https://omercelik.dev/tr/about. Every locale is prefixed. */
export function localeUrl(locale: string, path = "/"): string {
  return `${site.url}/${locale}${path === "/" ? "" : path}`;
}

/** Canonical + hreflang for a page that exists in every locale. Each locale is
 *  canonical for itself; x-default points at the default locale. */
export function alternatesFor(
  locale: string,
  path = "/",
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localeUrl(l, path);
  languages["x-default"] = localeUrl(routing.defaultLocale, path);
  return { canonical: localeUrl(locale, path), languages };
}

/** The locale an article belongs to: the one it was written in. Both UI
 *  languages render the same text, so that copy is the canonical one. */
export function articleLocale(lang: string): string {
  return hasLocale(routing.locales, lang) ? lang : routing.defaultLocale;
}

export const personId = `${site.url}/#person`;

/** Site-wide structured data: the person the site is about, and the site. */
export function siteJsonLd(locale: string, jobTitle: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: localeUrl(locale),
        image: `${site.url}/omer.jpg`,
        jobTitle,
        sameAs: [site.links.github, site.links.x, site.links.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.domain,
        inLanguage: locale,
        publisher: { "@id": personId },
      },
    ],
  };
}
