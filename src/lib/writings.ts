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
