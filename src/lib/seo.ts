import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { site } from "@/config/site";
import type { WritingMeta } from "@/lib/writings";

/** Absolute URL for a logical path in a locale: ("tr", "/about") →
 *  https://omercelik.dev/tr/about. Every locale is prefixed. */
export function localeUrl(locale: string, path = "/"): string {
  return `${site.url}/${locale}${path === "/" ? "" : path}`;
}

const RSS = { "application/rss+xml": `${site.url}/feed.xml` };

/** Canonical + hreflang (+ the RSS feed) for a page that exists in every
 *  locale. Each locale is canonical for itself; x-default is the default
 *  locale. Pages that set `alternates` replace the layout's wholesale, which
 *  is why the feed link travels with it. */
export function alternatesFor(
  locale: string,
  path = "/",
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localeUrl(l, path);
  languages["x-default"] = localeUrl(routing.defaultLocale, path);
  return { canonical: localeUrl(locale, path), languages, types: RSS };
}

/** The locale an article belongs to: the one it was written in. Both UI
 *  languages render the same text, so that copy is the canonical one. */
export function articleLocale(lang: string): string {
  return hasLocale(routing.locales, lang) ? lang : routing.defaultLocale;
}

const OG_LOCALE: Record<string, string> = { en: "en_US", tr: "tr_TR" };
const ogLocale = (locale: string) =>
  OG_LOCALE[locale] ?? OG_LOCALE[routing.defaultLocale];

/** The site's X handle, for X/Twitter cards. */
export const X_HANDLE = `@${new URL(site.links.x).pathname.replace(/^\/+/, "")}`;

/** Social cards are real .png routes, so every static host serves them with
 *  an image content type (an extensionless file would go out as binary). */
export const SITE_OG_IMAGE = "/og.png";
export const articleOgImage = (slug: string) => `/og/${slug}/card.png`;
const card = (url: string, alt: string) => ({ url, width: 1200, height: 630, alt });

/** Title, description, canonical/hreflang and social cards for a page that
 *  exists in every locale. Next merges metadata shallowly, so each page sets
 *  the whole openGraph/twitter block rather than relying on the layout's. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  noindex = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of "Title · Ömer Çelik" (the home page). */
  absoluteTitle?: boolean;
  /** Thin listing pages: keep them out of the index, but follow their links. */
  noindex?: boolean;
}): Metadata {
  const url = localeUrl(locale, path);
  const socialTitle = absoluteTitle ? title : `${title} · ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(locale, path),
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: socialTitle,
      description,
      locale: ogLocale(locale),
      alternateLocale: routing.locales.filter((l) => l !== locale).map(ogLocale),
      images: [card(SITE_OG_IMAGE, site.name)],
    },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      creator: X_HANDLE,
      title: socialTitle,
      description,
      images: [SITE_OG_IMAGE],
    },
  };
}

/** Metadata for an article: canonical in the language it's written in, its
 *  own social card, and the article fields search engines and feeds read. */
export function articleMetadata(post: WritingMeta): Metadata {
  const locale = articleLocale(post.lang);
  const url = localeUrl(locale, `/writings/${post.slug}`);
  const about = localeUrl(locale, "/about");
  const image = card(articleOgImage(post.slug), post.title);
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: site.name, url: about }],
    alternates: { canonical: url, types: RSS },
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title: post.title,
      description: post.description,
      locale: ogLocale(locale),
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [about],
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      site: X_HANDLE,
      creator: X_HANDLE,
      title: post.title,
      description: post.description,
      images: [image.url],
    },
  };
}

export const personId = `${site.url}/#person`;

/** Site-wide structured data: the person the site is about, and the site.
 *  alternateName covers the spelling people type without Turkish letters. */
export function siteJsonLd({
  locale,
  jobTitle,
  description,
  knowsAbout,
}: {
  locale: string;
  jobTitle: string;
  description: string;
  knowsAbout: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        alternateName: ["Omer Celik", site.githubUsername],
        url: localeUrl(locale),
        image: `${site.url}/omer.jpg`,
        jobTitle,
        description,
        knowsAbout,
        sameAs: [site.links.github, site.links.x, site.links.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        alternateName: site.domain,
        inLanguage: routing.locales,
        publisher: { "@id": personId },
      },
    ],
  };
}

/** The About page as a profile page — Google's type for a page about a person. */
export function profileJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: localeUrl(locale, "/about"),
    inLanguage: locale,
    mainEntity: { "@id": personId },
  };
}

const WRITINGS_LABEL: Record<string, string> = { en: "Writings", tr: "Yazılar" };

/** An article: BlogPosting plus its breadcrumb trail, in its canonical locale. */
export function articleJsonLd(post: WritingMeta) {
  const locale = articleLocale(post.lang);
  const url = localeUrl(locale, `/writings/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: `${site.url}${articleOgImage(post.slug)}`,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: post.lang,
        url,
        mainEntityOfPage: url,
        keywords: post.tags?.join(", "),
        author: { "@type": "Person", "@id": personId, name: site.name, url: localeUrl(locale, "/about") },
        publisher: { "@id": personId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: localeUrl(locale) },
          {
            "@type": "ListItem",
            position: 2,
            name: WRITINGS_LABEL[locale] ?? WRITINGS_LABEL.en,
            item: localeUrl(locale, "/writings"),
          },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
