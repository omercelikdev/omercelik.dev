import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { articleLocale, localeUrl } from "@/lib/seo";
import { getAllWritings } from "@/lib/writings";

// Emitted as a file at build time, like feed.xml — no request-time work.
export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/writings", "/products", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writings = await getAllWritings();

  // Pages that exist in every locale: one entry per locale, each pointing at
  // its siblings.
  const pages = STATIC_PATHS.flatMap((path) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, localeUrl(locale, path)]),
    );
    return routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      alternates: { languages },
    }));
  });

  // Articles once each, at their canonical copy (the language they're in).
  const posts = writings.map((w) => ({
    url: localeUrl(articleLocale(w.lang), `/writings/${w.slug}`),
    lastModified: new Date(w.date),
  }));

  return [...pages, ...posts];
}
