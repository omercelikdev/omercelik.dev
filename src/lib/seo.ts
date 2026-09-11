import type { Metadata } from "next";
import { site } from "@/config/site";
import type { WritingMeta } from "@/lib/writings";

/** Absolute URL for a path on the site: "/about" → https://omercelik.dev/about,
 *  "/" → https://omercelik.dev. */
export function absoluteUrl(path = "/"): string {
  return `${site.url}${path === "/" ? "" : path}`;
}

const RSS = { "application/rss+xml": `${site.url}/feed.xml` };

/** Open Graph locale for a piece of content. The interface is English;
 *  articles can be written in Turkish, and their cards say so. */
const OG_LOCALE: Record<string, string> = { en: "en_US", tr: "tr_TR" };
const ogLocale = (lang: string) => OG_LOCALE[lang] ?? OG_LOCALE.en;

/** The site's X handle, for X/Twitter cards. */
export const X_HANDLE = `@${new URL(site.links.x).pathname.replace(/^\/+/, "")}`;

/** Social cards are real .png routes, so every static host serves them with
 *  an image content type (an extensionless file would go out as binary). */
export const SITE_OG_IMAGE = "/og.png";
const articleOgImage = (slug: string) => `/og/${slug}/card.png`;
const card = (url: string, alt: string) => ({
  url,
  width: 1200,
  height: 630,
  alt,
});

/** Title, description, canonical and social cards for a page. Next merges
 *  metadata shallowly, so each page sets the whole openGraph/twitter block
 *  rather than relying on the layout's. */
export function pageMetadata({
  path,
  title,
  description,
  absoluteTitle = false,
  noindex = false,
}: {
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of "Title · Ömer Çelik" (the home page). */
  absoluteTitle?: boolean;
  /** Thin listing pages: keep them out of the index, but follow their links. */
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = absoluteTitle ? title : `${title} · ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    // Pages that set `alternates` replace the layout's wholesale, which is
    // why the feed link travels with the canonical.
    alternates: { canonical: url, types: RSS },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: socialTitle,
      description,
      locale: ogLocale("en"),
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

/** Metadata for an article: its own social card, in the language it's
 *  written in, and the article fields search engines and feeds read. */
export function articleMetadata(post: WritingMeta): Metadata {
  const url = absoluteUrl(`/writings/${post.slug}`);
  const about = absoluteUrl("/about");
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
      locale: ogLocale(post.lang),
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

const personId = `${site.url}/#person`;

/** Site-wide structured data: the person the site is about, and the site.
 *  alternateName covers the spelling people type without Turkish letters. */
export function siteJsonLd({
  jobTitle,
  description,
  knowsAbout,
}: {
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
        url: site.url,
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
        inLanguage: "en",
        publisher: { "@id": personId },
      },
    ],
  };
}

/** The About page as a profile page — Google's type for a page about a person. */
export function profileJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    mainEntity: { "@id": personId },
  };
}

/** An article: BlogPosting plus its breadcrumb trail. */
export function articleJsonLd(post: WritingMeta) {
  const url = absoluteUrl(`/writings/${post.slug}`);
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
        author: {
          "@type": "Person",
          "@id": personId,
          name: site.name,
          url: absoluteUrl("/about"),
        },
        publisher: { "@id": personId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Writings",
            item: absoluteUrl("/writings"),
          },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
