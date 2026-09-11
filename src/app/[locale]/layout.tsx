import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/config/site";
import { localeUrl, SITE_OG_IMAGE, siteJsonLd, X_HANDLE } from "@/lib/seo";
import "../globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
// Essay titles and pull quotes: an editorial serif next to the Geist UI.
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  // Site-wide defaults. Every page sets its own title, canonical and social
  // cards on top (lib/seo), replacing these — Next merges only shallowly.
  return {
    metadataBase: new URL(site.url),
    title: { default: t("homeTitle"), template: `%s · ${site.name}` },
    description: t("description"),
    applicationName: site.name,
    authors: [{ name: site.name, url: localeUrl(locale, "/about") }],
    creator: site.name,
    publisher: site.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t("homeTitle"),
      description: t("description"),
      images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      creator: X_HANDLE,
      images: [SITE_OG_IMAGE],
    },
    alternates: {
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const home = await getTranslations("home");
  const meta = await getTranslations("meta");
  const about = await getTranslations("about");

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      // Smooth scrolling for in-page anchors (see globals.css), which Next
      // turns off during route changes so navigation still jumps to the top.
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}
    >
      <body className="min-h-dvh bg-surface antialiased">
        <a
          href="#main"
          className="sr-only rounded-[var(--radius-lg)] bg-primary px-3.5 py-2 text-ui font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-50"
        >
          {nav("skip")}
        </a>
        <JsonLd
          data={siteJsonLd({
            locale,
            jobTitle: home("role"),
            description: meta("description"),
            knowsAbout: about.raw("toolbox") as string[],
          })}
        />
        <ThemeProvider>
          <NextIntlClientProvider>
            <div className="flex min-h-dvh flex-col">
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
