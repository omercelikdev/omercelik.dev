import { describe, expect, it } from "vitest";
import { absoluteUrl, articleMetadata, pageMetadata } from "./seo";
import type { WritingMeta } from "./writings";

const SITE = "https://omercelik.dev";

describe("absoluteUrl", () => {
  it("joins the site URL and a path", () => {
    expect(absoluteUrl("/")).toBe(SITE);
    expect(absoluteUrl("/about")).toBe(`${SITE}/about`);
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    path: "/about",
    title: "About",
    description: "Who I am and what I work on.",
  });

  it("is canonical at its own URL and links the feed", () => {
    expect(meta.alternates).toEqual({
      canonical: `${SITE}/about`,
      types: { "application/rss+xml": `${SITE}/feed.xml` },
    });
  });

  it("gives the social card the page's URL", () => {
    expect(meta.openGraph).toMatchObject({
      url: `${SITE}/about`,
      locale: "en_US",
      title: "About · Ömer Çelik",
    });
  });

  it("brands the title except when asked not to", () => {
    expect(meta.title).toBe("About");
    const home = pageMetadata({
      path: "/",
      title: "Ömer Çelik — Software Engineer",
      description: "…",
      absoluteTitle: true,
    });
    expect(home.title).toEqual({ absolute: "Ömer Çelik — Software Engineer" });
  });

  it("keeps thin pages out of the index but crawlable", () => {
    expect(meta.robots).toBeUndefined();
    const tag = pageMetadata({
      path: "/writings/tag/net",
      title: "Tagged: .net",
      description: "…",
      noindex: true,
    });
    expect(tag.robots).toEqual({ index: false, follow: true });
  });
});

describe("articleMetadata", () => {
  const post: WritingMeta = {
    slug: "mockifyr-neden",
    title: "Mockifyr'ı neden yazdım",
    description: "Bağımsız bir API mock motoru.",
    date: "2026-07-05",
    lang: "tr",
    tags: ["mockifyr"],
    readingMinutes: 1,
  };
  const meta = articleMetadata(post);

  it("is canonical at /writings/<slug>", () => {
    expect(meta.alternates?.canonical).toBe(`${SITE}/writings/mockifyr-neden`);
  });

  it("uses the article's own card, in the article's language", () => {
    expect(meta.openGraph).toMatchObject({
      type: "article",
      locale: "tr_TR",
      images: [{ url: "/og/mockifyr-neden/card.png" }],
    });
  });
});
