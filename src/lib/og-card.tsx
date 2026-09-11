// Social card layout for next/og (Satori). Colours are inlined — OG images
// can't read CSS variables — and mirror the light theme tokens.
const INK = "#18181b";
const MUTED = "#71717a";
const LINE = "#e4e4e7";
const ACCENT = "#3b5bdb";

export const OG_SIZE = { width: 1200, height: 630 };

/** 1200×630 card: brand mark, eyebrow, title, subtitle, footer — with the
 *  site's layered-stack motif on the right. */
export function OgCard({
  eyebrow,
  title,
  subtitle,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer: string;
}) {
  const long = title.length > 56;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 80,
        background: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      {/* the stack motif, bottom layer first so the top one paints last */}
      <div style={{ position: "absolute", right: 60, top: 150, display: "flex", width: 360, height: 340 }}>
        {[3, 2, 1, 0].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 70,
              top: 30 + i * 50,
              width: 230,
              height: 145,
              border: `2px solid ${i === 0 ? ACCENT : LINE}`,
              borderRadius: 18,
              background: "#ffffff",
              transform: "rotate(-30deg) skewX(30deg) scaleY(0.86)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 740,
        }}
      >
        {/* One text run: Satori puts visible space between adjacent runs, so
            the two-colour wordmark would read "omercelik .dev". */}
        <div style={{ display: "flex", fontSize: 26, color: MUTED }}>omercelik.dev</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {eyebrow && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: ACCENT,
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: long ? 54 : 68,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, color: MUTED }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: MUTED }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT }} />
          {footer}
        </div>
      </div>
    </div>
  );
}
