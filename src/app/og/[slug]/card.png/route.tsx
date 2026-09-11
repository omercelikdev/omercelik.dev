import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-card";
import { getWritingBySlug, getWritingSlugs } from "@/lib/writings";
import { site } from "@/config/site";

// One social card per article (out/og/<slug>/card.png), in the language the
// article is written in. Shared by both UI locales, like the article's
// canonical URL.
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getWritingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);
  const lang = post?.lang === "tr" ? "tr" : "en";
  const date = post
    ? new Intl.DateTimeFormat(lang, { year: "numeric", month: "long", day: "numeric" }).format(
        new Date(post.date),
      )
    : "";

  return new ImageResponse(
    (
      <OgCard
        eyebrow={lang === "tr" ? "Yazı" : "Writing"}
        title={post?.title ?? site.name}
        subtitle={post?.description}
        footer={[site.name, date].filter(Boolean).join(" · ")}
      />
    ),
    OG_SIZE,
  );
}
