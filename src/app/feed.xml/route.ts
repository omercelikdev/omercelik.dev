import { site } from "@/config/site";
import { localeUrl } from "@/lib/seo";
import { getAllWritings } from "@/lib/writings";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const writings = await getAllWritings();
  const updated = writings[0]?.date ?? new Date().toISOString();

  const items = writings
    .map((w) => {
      const url = localeUrl("en", `/writings/${w.slug}`);
      return `    <item>
      <title>${escape(w.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(w.date).toUTCString()}</pubDate>
      ${w.description ? `<description>${escape(w.description)}</description>` : ""}
      ${w.tags?.map((t) => `<category>${escape(t)}</category>`).join("\n      ") ?? ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)} — Writing</title>
    <link>${site.url}/writings</link>
    <description>Notes on software, systems and building things.</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
