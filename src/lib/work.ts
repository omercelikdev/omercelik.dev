import path from "node:path";
import {
  CONTENT_DIR,
  isPublished,
  listEntries,
  newestFirst,
  readMdx,
} from "./content";
import type { ThemeSlug } from "@/config/themes";

const WORK_DIR = path.join(CONTENT_DIR, "work");

/** What kind of work a case is. Only the kind is shown, never the employer. */
export type WorkKind =
  "client" | "internal" | "open-source" | "solution-design";

export const WORK_KINDS: readonly WorkKind[] = [
  "client",
  "internal",
  "open-source",
  "solution-design",
];

/** A case study: content/work/<slug>.mdx. The frontmatter is the card; the
 *  body is the story (context → decision → outcome). */
export interface WorkFrontmatter {
  title: string;
  /** One sentence for the card. */
  summary: string;
  /** Domain, never a client name ("Telco", "Banking"). */
  sector: string;
  role: string;
  /** One or two practice areas; the first decides where the case is listed. */
  themes: ThemeSlug[];
  kind: WorkKind;
  /** Slug of the overview case this one is a part of, if any. */
  programme?: string;
  /** Built AI-natively. Never set on client work. */
  aiNative?: boolean;
  /** "2024 — now", "2022 — 2023". */
  period: string;
  date: string;
  stack: string[];
  /** Outcome tiles on the card: value + label. `countTo` animates. */
  outcomes?: { value: string; label: string; countTo?: number }[];
  /** Labs that belong to this case, by slug. */
  labs?: string[];
  featured?: boolean;
  draft?: boolean;
}

export interface WorkMeta extends WorkFrontmatter {
  slug: string;
}

export interface Work extends WorkMeta {
  content: string;
}

async function readAll(): Promise<Work[]> {
  const files = (await listEntries(WORK_DIR)).filter((f) => /\.mdx?$/.test(f));
  const items = await Promise.all(
    files.map(async (file) => {
      const parsed = await readMdx<WorkFrontmatter>(path.join(WORK_DIR, file));
      if (!parsed) return null;
      const work: Work = {
        ...parsed.data,
        stack: parsed.data.stack ?? [],
        outcomes: parsed.data.outcomes ?? [],
        labs: parsed.data.labs ?? [],
        themes: parsed.data.themes ?? [],
        aiNative: parsed.data.aiNative ?? false,
        featured: parsed.data.featured ?? false,
        draft: parsed.data.draft ?? false,
        slug: file.replace(/\.mdx?$/, ""),
        content: parsed.content,
      };
      return work;
    }),
  );
  return items
    .filter((w): w is Work => w !== null)
    .filter(isPublished)
    .sort(newestFirst);
}

export async function getAllWork(): Promise<WorkMeta[]> {
  return (await readAll()).map(({ content: _content, ...meta }) => meta);
}

export async function getFeaturedWork(count = 2): Promise<WorkMeta[]> {
  const all = await getAllWork();
  const featured = all.filter((w) => w.featured);
  return (featured.length ? featured : all).slice(0, count);
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  return (await readAll()).find((w) => w.slug === slug) ?? null;
}

/** The parts of an overview case, in their listed order (oldest first). */
export async function getProgrammeParts(slug: string): Promise<WorkMeta[]> {
  return (await getAllWork())
    .filter((w) => w.programme === slug)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Case studies that share a practice area with `themes`: those whose main
 *  theme matches first, then featured ones, then the newest. */
export async function getWorkInThemes(
  themes: readonly string[],
  limit = 2,
): Promise<WorkMeta[]> {
  if (themes.length === 0) return [];
  const score = (w: WorkMeta) =>
    (themes.includes(w.themes[0]) ? 2 : 0) + (w.featured ? 1 : 0);
  return (await getAllWork())
    .filter((w) => w.themes.some((t) => themes.includes(t)))
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export async function getWorkSlugs(): Promise<string[]> {
  return (await getAllWork()).map((w) => w.slug);
}
