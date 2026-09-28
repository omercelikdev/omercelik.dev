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

/** The hero's delivery path, layer by layer: what each layer holds and who
 *  acts on it (AI produces, people decide, the engine verifies), explained
 *  beside it while in focus. */
export function HeroStack() {
  const t = useTranslations("home");
  const d = useTranslations("diagram");
  const descriptions = t.raw("layers") as string[];

  const layers: StackLayer[] = [
    {
      label: "Intent",
      detail: "people decide",
      body: (
        <Lines
          rows={[
            ["rule", "order.cancel", "accent"],
            ["owner", "business"],
            ["status", "signed", "pass"],
          ]}
        />
      ),
    },
    {
      label: "Spec",
      detail: "AI drafts · people sign",
      body: (
        <Lines
          rows={[
            ["spec", "cancel.spec.md"],
            ["rules", "RULE-12, RULE-14", "accent"],
            ["open questions", "0", "pass"],
          ]}
        />
      ),
    },
    {
      label: "Code",
      detail: "AI implements",
      body: (
        <Lines
          rows={[
            ["test", "red → green", "pass"],
            ["api", "Orders.Api"],
            ["commit", "RULE-12", "accent"],
          ]}
        />
      ),
    },
    {
      label: "Gates",
      detail: "the engine verifies",
      body: (
        <Lines
          rows={[
            ["drift", "none", "pass"],
            ["parity", "legacy = new", "pass"],
            ["rule and code", "in step", "pass"],
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
            ["trace", "order.cancelled"],
            ["rule", "RULE-12", "accent"],
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
