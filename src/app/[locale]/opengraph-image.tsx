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
          background: "#ffffff",
          padding: 84,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: "#71717a" }}>
          omercelik<span style={{ color: "#3b5bdb" }}>.dev</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              color: "#18181b",
              lineHeight: 1.05,
            }}
          >
            {site.name}
          </div>
          <div style={{ fontSize: 28, color: "#71717a", maxWidth: 820, lineHeight: 1.3 }}>
            AI-driven, spec-driven architecture — libraries, platforms &amp; products.
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
          <div style={{ width: 9, height: 9, borderRadius: 999, background: "#3b5bdb" }} />
          Products · Writing · Contact
        </div>
      </div>
    ),
    size,
  );
}
