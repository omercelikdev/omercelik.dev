# omercelik.dev

Personal site and writing of Ömer Çelik — open-source products and essays.

Built with **Next.js 16** (App Router, static export), **React 19**,
**Tailwind CSS v4**, **next-intl** and **MDX**.

## Develop

```bash
npm install
cp .env.example .env.local   # optional: add a GITHUB_TOKEN
npm run dev                  # http://localhost:3000 → picks /en or /tr
npm run build                # static site in ./out
npm run check                # lint + typecheck + format check + tests (as CI)
npm run format               # apply Prettier
```

## Quality gates

- **CI** — `.github/workflows/ci.yml`, on every push to `main` and every pull
  request: lint, typecheck, format check, tests, then the static build. The
  build fails if any product card couldn't be fetched, and the job checks the
  key files in `out/` exist.
- **Dependabot** — `.github/dependabot.yml`, weekly. Minor and patch updates
  arrive grouped (Next.js and its ESLint config together); a major version
  arrives as its own pull request. GitHub Actions are grouped.
- **Tests** — Vitest, `src/**/*.test.ts`: heading ids match rehype-slug, tag
  slugs, the SEO helpers, and EN/TR message parity (same keys, same list
  lengths, no empty strings).
- **Tooling** — Node 24 (`.nvmrc`), Prettier defaults, `.editorconfig`.
  Essays under `content/` are left out of formatting on purpose.

## How it's put together

- **Static export** — `output: "export"`: every page is plain HTML generated at
  build time. There is no server and no proxy/middleware.
- **Languages** — English and Turkish UI, every URL prefixed (`/en/…`,
  `/tr/…`). The root `/` picks the visitor's language in the browser
  (`src/app/page.tsx`). Articles stay in the language they were written in, and
  that language's copy is the canonical URL.
- **Design tokens** — colours, radius and elevation live in
  `src/app/theme.css`; the type scale (`text-meta` … `text-display`) in
  `src/app/globals.css`. Use the scale rather than arbitrary sizes.
- **Motion** — CSS first: `.intro` for page-load entrances, `.reveal` for
  scroll-linked ones (`animation-timeline: view()`). Content is visible without
  JavaScript, and `prefers-reduced-motion` switches it all off.
- **Signature diagram** — `src/components/diagram/`: an isometric stack of
  architecture layers in CSS 3D (no WebGL), calm by design — nothing moves on
  its own. Pointing at a layer opens the stack there (the layers above lift
  and draw back, the focused one comes forward and lights up, its description
  shows below); the legend does the same on hover or keyboard focus and pins
  a layer on click; on touch, tapping a layer pins it. Invisible hit surfaces
  at the layers' resting positions decide which layer is under the pointer,
  so the focus doesn't jump while the stack opens. It opens a little as the page
  scrolls and never tilts, so the layers stay where the pointer expects them.
  Without JavaScript or with reduced motion it's a still diagram.
- **SEO** — `src/lib/seo.ts`: every page gets its title, description,
  canonical, hreflang, Open Graph and X card from `pageMetadata` /
  `articleMetadata` (Next merges metadata shallowly, so pages set the whole
  block). Structured data: Person + WebSite everywhere, ProfilePage on About,
  BlogPosting + BreadcrumbList on articles. Social cards are real `.png`
  routes (`src/app/og.png`, `src/app/og/[slug]/card.png`) so static hosts
  serve them as images. Tag pages are `noindex, follow`.
- **Type** — Geist for the interface, Newsreader (serif) for essay titles and
  pull quotes.
- **Products** — read from the GitHub API at build time; curate the list in
  `src/config/products.ts`. Set `GITHUB_TOKEN` wherever the build runs:
  unauthenticated requests are limited to 60 an hour per IP, and a failed
  request drops that card from the build (with a `[products]` warning in the
  build log).
- **Contact** — no backend: the form opens the visitor's own mail app with the
  message filled in, and says so.

## Writing

Create `content/writings/<slug>.mdx`:

```mdx
---
title: "My post"
description: "One-line summary."
date: "2026-09-11"
lang: "en" # en | tr — the language the piece is written in
tags: ["architecture"]
draft: true # optional: visible in `npm run dev` only
series: "Golden paths" # optional, with seriesOrder: 1
---

Your MDX content…
```

What an article can use:

- **Code** — fenced blocks are highlighted with Shiki (light + dark). Add a
  file name and highlighted lines with ` ```ts title="lib/x.ts" {2-3} `, and
  line numbers with `showLineNumbers`. Every block gets a copy button.
- **Callouts** — `<Callout type="note | tip | warning" title="…">…</Callout>`.
- **Figures** — `<Figure src="/writings/diagram.png" alt="…" caption="…" />`,
  with the image under `public/writings/`.
- **Pull quotes** — `<PullQuote cite="…">The line you want remembered.</PullQuote>`,
  set large in the serif.
- **Layer diagrams** — the hero's 3D stack, for your own systems:

  ```mdx
  <LayerStack title="Where each guarantee lives">
    <Layer label="Spec" detail="manifest.yaml" note="What must be true." />
    <Layer label="Code" detail="generated" />
  </LayerStack>
  ```

  String props only — the MDX pipeline doesn't evaluate `{…}` expressions.

- **Featured** — `featured: true` in the frontmatter leads the home page with
  that essay.
- **GFM** — tables, task lists and footnotes (`[^1]`).
- **Table of contents** — appears automatically from three h2/h3 headings up.
- **Comments** — Giscus (GitHub Discussions), one thread per post shared by
  both languages.

## Configure

| What                                | Where                      |
| ----------------------------------- | -------------------------- |
| Name, email, social links, comments | `src/config/site.ts`       |
| Which repos show as products        | `src/config/products.ts`   |
| Colours, radius, shadows            | `src/app/theme.css`        |
| Type scale, motion, code styling    | `src/app/globals.css`      |
| UI copy (EN / TR)                   | `src/i18n/messages/*.json` |
| Supported locales                   | `src/i18n/routing.ts`      |

## Deploy — Cloudflare Workers Builds

Same setup as the `*.qorpe.com` sites: `wrangler.jsonc` serves `./out` as
Worker static assets, with `404.html` for unknown paths.

1. Connect the repository in Cloudflare **Workers Builds**. Build command:
   `npm run build`; deploy command: `npx wrangler deploy`.
2. Add a `GITHUB_TOKEN` build variable — a token with no permissions is enough
   to read public repositories.
3. Attach the `omercelik.dev` custom domain to the Worker.

## After the first deploy — search engines

The site ships everything search engines read (sitemap, canonicals,
structured data); these steps tell them it exists:

1. **Google Search Console** — add a _Domain_ property for `omercelik.dev`,
   verify with the DNS TXT record (in Cloudflare DNS), then submit
   `https://omercelik.dev/sitemap.xml`. Use _URL inspection → Request
   indexing_ for the home page and each new essay.
2. **Bing Webmaster Tools** — import the site from Search Console (Bing also
   feeds DuckDuckGo and others).
3. **Link back to the site** from GitHub, LinkedIn and X profiles — the same
   URLs listed as `sameAs` in the Person structured data. Consistent profiles
   are what tie searches for the name to this site.
4. Check a page with Google's Rich Results Test and share one link on
   LinkedIn/X to confirm the social card.
