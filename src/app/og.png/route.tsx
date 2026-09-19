import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-card";
import { site } from "@/config/site";

// The site's social card, written to out/og.png at build time.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <OgCard
      eyebrow="Software engineer"
      title={site.name}
      subtitle="Software architect. AI-era enterprise .NET systems you can prove."
      footer="Essays · Products · omercelik.dev"
    />,
    OG_SIZE,
  );
}
