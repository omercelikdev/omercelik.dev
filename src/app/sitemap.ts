import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllWritings } from "@/lib/writings";
import { getAllWork } from "@/lib/work";
import { getAllLabs } from "@/lib/labs";

// Emitted as a file at build time, like feed.xml — no request-time work.
export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/work", "/labs", "/writings", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [writings, work, labs] = await Promise.all([
    getAllWritings(),
    getAllWork(),
    getAllLabs(),
  ]);
  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...writings.map((w) => ({
      url: absoluteUrl(`/writings/${w.slug}`),
      lastModified: new Date(w.updated ?? w.date),
    })),
    ...work.map((w) => ({
      url: absoluteUrl(`/work/${w.slug}`),
      lastModified: new Date(w.date),
    })),
    ...labs.map((l) => ({
      url: absoluteUrl(`/labs/${l.slug}`),
      lastModified: new Date(l.date),
    })),
  ];
}
