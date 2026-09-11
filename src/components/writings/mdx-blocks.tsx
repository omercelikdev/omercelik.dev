import type { ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";

const CALLOUT = {
  note: { Icon: Info, tone: "border-info-border bg-info-bg text-info" },
  tip: { Icon: Lightbulb, tone: "border-success-border bg-success-bg text-success" },
  warning: { Icon: TriangleAlert, tone: "border-warning-border bg-warning-bg text-warning" },
} as const;

/** An aside that stands apart from the running text. In MDX:
 *  <Callout type="tip" title="Short version">…</Callout> */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof CALLOUT;
  title?: string;
  children: ReactNode;
}) {
  const { Icon, tone } = CALLOUT[type];
  return (
    <aside className={`mt-6 flex gap-3 rounded-[var(--radius-xl)] border px-4 py-3.5 ${tone}`}>
      <Icon className="mt-1 size-4 flex-none" aria-hidden />
      <div className="min-w-0 text-foreground [&>p]:mt-2 [&>p]:text-body [&>p:first-child]:mt-0">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
    </aside>
  );
}

/** An image with a caption. In MDX:
 *  <Figure src="/writings/diagram.png" alt="…" caption="…" /> */
export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
}) {
  return (
    <figure className="mt-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full rounded-[var(--radius-xl)] border border-border"
      />
      {caption && (
        <figcaption className="mt-2.5 text-center text-caption text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
