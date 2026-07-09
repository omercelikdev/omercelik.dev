import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/seo";
import { getAllWritings } from "@/lib/writings";

const STATIC_PATHS = ["/", "/products", "/writings", "/about"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writings = await getAllWritings();
  const paths = [...STATIC_PATHS, ...writings.map((w) => `/writings/${w.slug}`)];

  return paths.map((path) => ({
    url: localeUrl(routing.defaultLocale, path),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, localeUrl(locale, path)]),
      ),
    },
  }));
}
