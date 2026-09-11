import { ImageResponse } from "next/og";
import { getWritingBySlug, getWritingSlugs } from "@/lib/writings";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";

export const alt = "Writing — omercelik.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered to a PNG at build time, one per article.
export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await getWritingSlugs();
  // Metadata image routes don't inherit the locale from the layout's params
  // the way pages do, so spell out the full locale × slug matrix.
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

// Per-article social card so shared links (LinkedIn, X) show the post title.
export default async function WritingOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);
  const title = post?.title ?? "Writing";
  const date = post
    ? new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(
        new Date(post.date),
      )
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: 84,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#71717a" }}>
          omercelik<span style={{ color: "#3b5bdb" }}>.dev</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 56 : 68,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "#18181b",
            lineHeight: 1.08,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: "#a1a1aa" }}>
          <div style={{ width: 9, height: 9, borderRadius: 999, background: "#3b5bdb" }} />
          <span>Writing</span>
          {date && <span style={{ color: "#d4d4d8" }}>·</span>}
          {date && <span>{date}</span>}
          <span style={{ marginLeft: "auto", color: "#71717a" }}>{site.name}</span>
        </div>
      </div>
    ),
    size,
  );
}
