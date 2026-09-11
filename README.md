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
```

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
- **Motion** — CSS only: `.intro` for page-load entrances, `.reveal` for
  scroll-linked ones (`animation-timeline: view()`). Content is visible without
  JavaScript, and `prefers-reduced-motion` switches it all off.
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
lang: "en"            # en | tr — the language the piece is written in
tags: ["architecture"]
draft: true           # optional: visible in `npm run dev` only
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
- **GFM** — tables, task lists and footnotes (`[^1]`).
- **Table of contents** — appears automatically from three h2/h3 headings up.
- **Comments** — Giscus (GitHub Discussions), one thread per post shared by
  both languages.

## Configure

| What | Where |
| --- | --- |
| Name, email, social links, comments | `src/config/site.ts` |
| Which repos show as products | `src/config/products.ts` |
| Colours, radius, shadows | `src/app/theme.css` |
| Type scale, motion, code styling | `src/app/globals.css` |
| UI copy (EN / TR) | `src/i18n/messages/*.json` |
| Supported locales | `src/i18n/routing.ts` |

## Deploy — Cloudflare Workers Builds

Same setup as the `*.qorpe.com` sites: `wrangler.jsonc` serves `./out` as
Worker static assets, with `404.html` for unknown paths.

1. Connect the repository in Cloudflare **Workers Builds**. Build command:
   `npm run build`; deploy command: `npx wrangler deploy`.
2. Add a `GITHUB_TOKEN` build variable — a token with no permissions is enough
   to read public repositories.
3. Attach the `omercelik.dev` custom domain to the Worker.
