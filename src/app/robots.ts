import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Emitted as a file at build time, like feed.xml — no request-time work.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
