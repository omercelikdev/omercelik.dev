import { Children, isValidElement, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import {
  ArchitectureStack,
  type StackLayer,
} from "@/components/diagram/architecture-stack";

const CALLOUT = {
  note: { Icon: Info, tone: "border-info-border bg-info-bg text-info" },
  tip: {
    Icon: Lightbulb,
    tone: "border-success-border bg-success-bg text-success",
  },
  warning: {
    Icon: TriangleAlert,
    tone: "border-warning-border bg-warning-bg text-warning",
  },
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
    <aside
      className={`mt-6 flex gap-3 rounded-[var(--radius-xl)] border px-4 py-3.5 ${tone}`}
    >
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

/** The sentence you want remembered, set large in the editorial serif. In MDX:
 *  <PullQuote cite="Optional source">A spec is a promise…</PullQuote> */
export function PullQuote({
  children,
  cite,
}: {
  children: ReactNode;
  cite?: string;
}) {
  return (
    <figure className="my-10 border-s-2 border-brand-accent ps-6">
      <blockquote className="font-serif text-quote text-foreground [&>p]:mt-0 [&>p]:font-serif [&>p]:text-quote [&>p]:text-foreground">
        {children}
      </blockquote>
      {cite && (
        <figcaption className="mono mt-3 text-caption text-muted-foreground">
          — {cite}
        </figcaption>
      )}
    </figure>
  );
}

interface LayerProps {
  label: string;
  detail?: string;
  note?: string;
}

/** One layer of a LayerStack; rendered by the stack, not on its own. */
export function Layer(_props: LayerProps) {
  return null;
}

/** The hero's 3D stack as an article diagram, top layer first. In MDX:
 *  <LayerStack title="How a request is verified">
 *    <Layer label="Spec" detail="manifest.yaml" note="What must be true." />
 *    <Layer label="Code" detail="generated" />
 *  </LayerStack>
 *  Plain string props only — the MDX pipeline doesn't evaluate expressions. */
export function LayerStack({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const t = useTranslations("diagram");
  const layers: StackLayer[] = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const { label, detail, note } = child.props as LayerProps;
      return { label, detail, note };
    })
    .filter((layer) => Boolean(layer.label));
  if (layers.length === 0) return null;

  const description = title ?? layers.map((layer) => layer.label).join(" → ");
  return (
    <div className="my-10">
      <ArchitectureStack
        variant="inline"
        layers={layers}
        description={description}
        legendLabel={t("layers")}
        idle={title}
      />
    </div>
  );
}
