import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const WRITINGS_DIR = path.join(process.cwd(), "content", "writings");

export interface WritingFrontmatter {
  title: string;
  description?: string;
  date: string;
  /** BCP-47 language the piece was written in (e.g. "en", "tr"). Content is
   *  never machine-translated; this is only used for the language badge. */
  lang: string;
  tags?: string[];
  draft?: boolean;
  /** Optional series this post belongs to (a human-readable series title). */
  series?: string;
  /** Position within the series (1-based); used to order series posts. */
  seriesOrder?: number;
}

export interface WritingMeta extends WritingFrontmatter {
  slug: string;
  readingMinutes: number;
}

export interface Writing extends WritingMeta {
  content: string;
}

async function readFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(WRITINGS_DIR);
    return entries.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch {
    return [];
  }
}

function parse(fileName: string, raw: string): Writing {
  const { data, content } = matter(raw);
  const fm = data as WritingFrontmatter;
  return {
    slug: fileName.replace(/\.mdx?$/, ""),
    title: fm.title,
    description: fm.description,
    date: fm.date,
    lang: fm.lang ?? "en",
    tags: fm.tags ?? [],
    draft: fm.draft ?? false,
    series: fm.series,
    seriesOrder: fm.seriesOrder,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    content,
  };
}

const isPublished = (w: Writing) =>
  !w.draft || process.env.NODE_ENV !== "production";

/** All published writings, newest first. */
export async function getAllWritings(): Promise<WritingMeta[]> {
  const files = await readFiles();
  const all = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(WRITINGS_DIR, file), "utf-8");
      return parse(file, raw);
    }),
  );
  return all
    .filter(isPublished)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(({ content: _content, ...meta }) => meta);
}

export async function getWritingBySlug(slug: string): Promise<Writing | null> {
  const files = await readFiles();
  const match = files.find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!match) return null;
  const raw = await fs.readFile(path.join(WRITINGS_DIR, match), "utf-8");
  const writing = parse(match, raw);
  return isPublished(writing) ? writing : null;
}

export async function getLatestWritings(count = 3): Promise<WritingMeta[]> {
  return (await getAllWritings()).slice(0, count);
}

export async function getWritingSlugs(): Promise<string[]> {
  return (await getAllWritings()).map((w) => w.slug);
}

const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u",
};

/** URL-safe slug for a tag ("Golden Paths" -> "golden-paths", "Mühendislik"
 *  -> "muhendislik"). Transliterates Turkish letters, then normalizes. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[çğıöşüâîû]/g, (c) => TR_MAP[c] ?? c)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every tag with its post count and slug, most-used first. */
export async function getAllTags(): Promise<
  { tag: string; slug: string; count: number }[]
> {
  const all = await getAllWritings();
  const map = new Map<string, { tag: string; count: number }>();
  for (const w of all) {
    for (const tag of w.tags ?? []) {
      const slug = tagSlug(tag);
      const entry = map.get(slug);
      if (entry) entry.count += 1;
      else map.set(slug, { tag, count: 1 });
    }
  }
  return [...map.entries()]
    .map(([slug, { tag, count }]) => ({ tag, slug, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts carrying the given tag (matched by slug), newest first. */
export async function getWritingsByTag(slug: string): Promise<WritingMeta[]> {
  return (await getAllWritings()).filter((w) =>
    (w.tags ?? []).some((t) => tagSlug(t) === slug),
  );
}

/** All posts in a series, ordered by seriesOrder (then date). */
export async function getSeriesPosts(series: string): Promise<WritingMeta[]> {
  const all = await getAllWritings();
  return all
    .filter((w) => w.series === series)
    .sort(
      (a, b) =>
        (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0) ||
        +new Date(a.date) - +new Date(b.date),
    );
}
