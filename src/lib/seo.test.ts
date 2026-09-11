import { describe, expect, it } from "vitest";
import { articleLocale, localeUrl, pageMetadata } from "./seo";

const SITE = "https://omercelik.dev";

describe("localeUrl", () => {
  it("prefixes every locale, the default one included", () => {
    expect(localeUrl("en")).toBe(`${SITE}/en`);
    expect(localeUrl("tr", "/about")).toBe(`${SITE}/tr/about`);
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    locale: "tr",
    path: "/about",
    title: "Hakkında",
    description: "Kimim ve ne üzerine çalışıyorum.",
  });

  it("is canonical for its own locale", () => {
    expect(meta.alternates?.canonical).toBe(`${SITE}/tr/about`);
  });

  it("lists every locale, plus x-default on the default locale", () => {
    expect(meta.alternates?.languages).toEqual({
      en: `${SITE}/en/about`,
      tr: `${SITE}/tr/about`,
      "x-default": `${SITE}/en/about`,
    });
  });

  it("gives the social card the page's own URL and locale", () => {
    expect(meta.openGraph?.url).toBe(`${SITE}/tr/about`);
    expect(meta.openGraph?.locale).toBe("tr_TR");
  });

  it("brands the title except when asked not to", () => {
    expect(meta.title).toBe("Hakkında");
    expect(meta.openGraph?.title).toBe("Hakkında · Ömer Çelik");
    const home = pageMetadata({
      locale: "en",
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
      locale: "en",
      path: "/writings/tag/net",
      title: "Tagged: .net",
      description: "…",
      noindex: true,
    });
    expect(tag.robots).toEqual({ index: false, follow: true });
  });
});

describe("articleLocale", () => {
  it("is the language the article is written in, if the UI has it", () => {
    expect(articleLocale("tr")).toBe("tr");
    expect(articleLocale("de")).toBe("en");
  });
});
