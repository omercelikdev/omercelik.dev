import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og-card";
import { site } from "@/config/site";

// The site's social card, written to out/og.png at build time.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <OgCard
      eyebrow="Lead Developer"
      title={site.name}
      subtitle="Enterprise systems architecture · Governed AI in software delivery"
      footer="Work · Labs · Writing · omercelik.dev"
    />,
    OG_SIZE,
  );
}
