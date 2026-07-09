import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, rtlLocales, type Locale } from "@/i18n/routing";
import { ThemeScript } from "@/components/theme/theme-script";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { site } from "@/config/site";
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
  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: site.url,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      types: { "application/rss+xml": `${site.url}/feed.xml` },
    },
  };
}

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

  const dir = rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    email: site.email,
    sameAs: [site.links.github, site.links.x, site.links.linkedin],
    jobTitle: "Software Engineer",
  };

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme="light"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-surface antialiased">
        <NextIntlClientProvider>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
