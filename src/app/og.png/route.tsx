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
      subtitle="Open-source developer infrastructure: AI-native, spec-driven golden paths and composable .NET libraries."
      footer="Essays · Products · omercelik.dev"
    />,
    OG_SIZE,
  );
}
