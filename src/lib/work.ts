import path from "node:path";
import {
  CONTENT_DIR,
  isPublished,
  listEntries,
  newestFirst,
  readMdx,
} from "./content";

const WORK_DIR = path.join(CONTENT_DIR, "work");

/** A case study: content/work/<slug>.mdx. The frontmatter is the card; the
 *  body is the story (context → decision → outcome). */
export interface WorkFrontmatter {
  title: string;
  /** One sentence for the card. */
  summary: string;
  /** Domain, never a client name ("Telco", "Banking"). */
  sector: string;
  role: string;
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

export async function getWorkSlugs(): Promise<string[]> {
  return (await getAllWork()).map((w) => w.slug);
}
