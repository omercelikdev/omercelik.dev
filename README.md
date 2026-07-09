# omercelik.dev

Personal website and writing — a quiet home for open-source products and essays.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4**,
**next-intl** and **MDX**. Design language ported from the Mockifyr design system
("quiet frame, lively content").

## Features

- **i18n** — English (default, no URL prefix) plus Arabic (RTL), German, French,
  Chinese and Japanese. UI strings are translated in `src/i18n/messages/*.json`;
  articles stay in the language they were written in.
- **Theme** — light by default, dark toggle, no flash on load. All colours are
  design tokens in one file (`src/app/theme.css`) — swap them to re-skin.
- **Products** — pulled live from the GitHub API and cached hourly. Curate the
  list in `src/config/products.ts`.
- **Writing** — MDX files in `content/writings/`. Frontmatter drives the title,
  date, language badge, tags and reading time. Code is highlighted with Shiki
  (dual light/dark theme).
- **Contact** — dependency-free: the form composes a pre-filled message in the
  visitor's mail client (no backend, no email service). Swap in an API route +
  provider later if you want server-side sending.

## Develop

```bash
npm install
cp .env.example .env.local   # optional: add a GITHUB_TOKEN
npm run dev                  # http://localhost:3000
npm run build                # production build
```

## Add a post

Create `content/writings/<slug>.mdx`:

```mdx
---
title: "My post"
description: "One-line summary."
date: "2026-07-09"
lang: "en"
tags: ["tag"]
---

Your MDX content…
```

## Configure

| What | Where |
| --- | --- |
| Name, email, social links | `src/config/site.ts` |
| Which repos show as products | `src/config/products.ts` |
| Design tokens (colours, radius, shadows) | `src/app/theme.css` |
| UI translations | `src/i18n/messages/*.json` |
| Supported locales | `src/i18n/routing.ts` |

## Deploy

Deploys to **Vercel** out of the box. Set `GITHUB_TOKEN` in the project's
environment variables (optional but recommended).
