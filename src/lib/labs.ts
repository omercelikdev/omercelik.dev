import path from "node:path";
import {
  CONTENT_DIR,
  isPublished,
  listEntries,
  newestFirst,
  readMdx,
} from "./content";
import type { ThemeSlug } from "@/config/themes";

export const LABS_DIR = path.join(CONTENT_DIR, "labs");

/** A lab is a folder: content/labs/<slug>/lab.mdx (what it shows) next to
 *  Demo.tsx (the thing itself, a client component with mock data). Adding
 *  the folder is all it takes — `npm run gen` (run before dev and build)
 *  registers the demo so the Labs page, the home page and <Demo id="…" />
 *  in any essay can find it. */

export interface LabFrontmatter {
  title: string;
  /** One sentence: what you can try. */
  summary: string;
  date: string;
  tags?: string[];
  /** Which practice it demonstrates ("quality", "spec", "orchestration"…). */
  topic?: string;
  /** The little picture on the card: a flow, bars or a process. */
  preview?: "flow" | "bars" | "process" | "gate";
  /** The essay that explains it, by slug. */
  writing?: string;
  /** Practice areas (see src/config/themes.ts). */
  themes?: ThemeSlug[];
  draft?: boolean;
}

export interface LabMeta extends LabFrontmatter {
  slug: string;
}

export interface Lab extends LabMeta {
  /** The essay-style notes under the demo. */
  content: string;
}

async function readAll(): Promise<Lab[]> {
  const dirs = await listEntries(LABS_DIR);
  const items = await Promise.all(
    dirs.map(async (slug) => {
      const parsed = await readMdx<LabFrontmatter>(
        path.join(LABS_DIR, slug, "lab.mdx"),
      );
      if (!parsed) return null;
      const lab: Lab = {
        ...parsed.data,
        tags: parsed.data.tags ?? [],
        themes: parsed.data.themes ?? [],
        draft: parsed.data.draft ?? false,
        slug,
        content: parsed.content,
      };
      return lab;
    }),
  );
  return items
    .filter((l): l is Lab => l !== null)
    .filter(isPublished)
    .sort(newestFirst);
}

export async function getAllLabs(): Promise<LabMeta[]> {
  return (await readAll()).map(({ content: _content, ...meta }) => meta);
}

export async function getLatestLabs(count = 3): Promise<LabMeta[]> {
  return (await getAllLabs()).slice(0, count);
}

export async function getLabBySlug(slug: string): Promise<Lab | null> {
  return (await readAll()).find((l) => l.slug === slug) ?? null;
}

export async function getLabSlugs(): Promise<string[]> {
  return (await getAllLabs()).map((l) => l.slug);
}

export async function getLabsBySlugs(slugs: string[]): Promise<LabMeta[]> {
  const all = await getAllLabs();
  return slugs
    .map((slug) => all.find((l) => l.slug === slug))
    .filter((l): l is LabMeta => Boolean(l));
}
