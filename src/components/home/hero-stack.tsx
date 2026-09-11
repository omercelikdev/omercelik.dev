import { useTranslations } from "next-intl";
import {
  ArchitectureStack,
  stackStyles as s,
  type StackLayer,
} from "@/components/diagram/architecture-stack";

type Tone = "accent" | "pass";

const INLINE_LINK =
  "font-medium text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-foreground";

/** The two tools the stack depicts. */
const SIGNATURE_REPOS = {
  goldpath: "https://github.com/qorpe/goldpath",
  specdrift: "https://github.com/qorpe/specdrift",
};

function repoLink(href: string) {
  const RepoLink = (chunks: React.ReactNode) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={INLINE_LINK}
    >
      {chunks}
    </a>
  );
  return RepoLink;
}

/** Three key/value lines — every layer's face has exactly this shape. */
function Lines({
  rows,
}: {
  rows: [key: string, value: string, tone?: Tone][];
}) {
  return (
    <div className={s.code}>
      {rows.map(([key, value, tone]) => (
        <div key={key}>
          <span className={s.k}>{key}: </span>
          <span className={tone ? s[tone] : s.v}>{value}</span>
        </div>
      ))}
    </div>
  );
}

/** The hero's stack: a golden path from spec to runtime, each layer showing
 *  what lives there and explained below while it's in focus. */
export function HeroStack() {
  const t = useTranslations("home");
  const d = useTranslations("diagram");
  const descriptions = t.raw("layers") as string[];

  const layers: StackLayer[] = [
    {
      label: "Spec",
      detail: "manifest.yaml",
      body: (
        <Lines
          rows={[
            ["service", "orders"],
            ["contracts", "openapi", "accent"],
            ["invariants", "12"],
          ]}
        />
      ),
    },
    {
      label: "Contracts",
      detail: "OpenAPI · AsyncAPI",
      body: (
        <Lines
          rows={[
            ["GET", "/orders/{id}", "accent"],
            ["POST", "/orders", "accent"],
            ["event", "order.created", "accent"],
          ]}
        />
      ),
    },
    {
      label: "Code",
      detail: "generated · .NET",
      body: (
        <Lines
          rows={[
            ["api", "Orders.Api"],
            ["domain", "Orders.Domain"],
            ["tests", "Orders.Tests"],
          ]}
        />
      ),
    },
    {
      label: "Verify",
      detail: "specdrift",
      body: (
        <Lines
          rows={[
            ["invariants", "12 / 12", "pass"],
            ["drift", "none", "pass"],
            ["contracts", "in sync", "pass"],
          ]}
        />
      ),
    },
    {
      label: "Runtime",
      detail: "OpenTelemetry",
      body: (
        <Lines
          rows={[
            ["trace", "order.created"],
            ["span", "POST /orders"],
            ["status", "ok", "pass"],
          ]}
        />
      ),
    },
  ].map((layer, i) => ({ ...layer, description: descriptions[i] }));

  return (
    <ArchitectureStack
      layers={layers}
      description={t("stackDescription")}
      legendLabel={d("layers")}
      idle={t.rich("signature", {
        goldpath: repoLink(SIGNATURE_REPOS.goldpath),
        specdrift: repoLink(SIGNATURE_REPOS.specdrift),
      })}
    />
  );
}
