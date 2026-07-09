import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static social card. Colours are inlined (OG images can't read CSS variables);
// they mirror the light theme tokens — update if you re-skin the brand.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f5f7",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#18181b",
              color: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 800,
            }}
          >
            Ö
          </div>
          <div style={{ fontSize: 24, color: "#71717a" }}>{site.domain}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#18181b",
              lineHeight: 1.1,
            }}
          >
            {site.name}
          </div>
          <div style={{ fontSize: 30, color: "#71717a", maxWidth: 800 }}>
            Open-source products &amp; writing about the craft.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontSize: 22,
            color: "#a1a1aa",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#6d28d9" }} />
          GitHub · Writing · Products
        </div>
      </div>
    ),
    size,
  );
}
