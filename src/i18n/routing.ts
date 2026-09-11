import { defineRouting } from "next-intl/routing";

/** Supported UI locales. Articles stay in the language they were written in;
 *  this only picks the language of the interface around them. */
export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // Every URL carries its locale (/en/…, /tr/…). The site is a static export,
  // so there is no server to map prefix-less paths onto a language; the root
  // page (app/page.tsx) picks one in the browser instead.
  localePrefix: "always",
});
