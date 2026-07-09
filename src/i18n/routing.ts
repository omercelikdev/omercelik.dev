import { defineRouting } from "next-intl/routing";

/** All supported UI locales. English is the default and is served without a
 *  path prefix; every other locale lives under /<locale>/… */
export const locales = ["en", "tr", "ar", "de", "fr", "zh", "ja"] as const;
export type Locale = (typeof locales)[number];

/** Locales that read right-to-left. */
export const rtlLocales: readonly Locale[] = ["ar"];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
