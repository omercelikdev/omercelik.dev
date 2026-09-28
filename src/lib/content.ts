import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/** Shared plumbing for the content folders (writings, work, labs): read
 *  frontmatter, hide drafts in production, sort newest first. */

export const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Dated {
  date: string;
  draft?: boolean;
}

export const isPublished = (item: Dated) =>
  !item.draft || process.env.NODE_ENV !== "production";

export const newestFirst = <T extends Dated>(a: T, b: T) =>
  +new Date(b.date) - +new Date(a.date);

/** Parse an MDX file into frontmatter + body. */
export async function readMdx<T>(
  file: string,
): Promise<{ data: T; content: string } | null> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    const { data, content } = matter(raw);
    return { data: data as T, content };
  } catch {
    return null;
  }
}

/** Names of the entries in a content folder (files or directories). */
export async function listEntries(dir: string): Promise<string[]> {
  try {
    return (await fs.readdir(dir)).filter((name) => !name.startsWith("."));
  } catch {
    return [];
  }
}
