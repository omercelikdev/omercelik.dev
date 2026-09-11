import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllWritings } from "@/lib/writings";

// Emitted as a file at build time, like feed.xml — no request-time work.
export const dynamic = "force-static";

const STATIC_PATHS = ["/", "/writings", "/products", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writings = await getAllWritings();
  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) })),
    ...writings.map((w) => ({
      url: absoluteUrl(`/writings/${w.slug}`),
      lastModified: new Date(w.updated ?? w.date),
    })),
  ];
}
