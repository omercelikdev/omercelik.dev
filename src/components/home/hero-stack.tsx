import { useTranslations } from "next-intl";
import {
  ArchitectureStack,
  stackStyles as s,
  type StackLayer,
} from "@/components/diagram/architecture-stack";

const CODE_BARS = [78, 54, 66, 40, 58];
const SPARK = "M0 26 L12 21 L24 23 L36 15 L48 18 L60 10 L72 14 L84 8 L96 12 L108 5 L120 9";

/** The hero's stack: a golden path from spec to runtime, each layer drawn
 *  with a hint of what lives there and explained while it's in focus. */
export function HeroStack() {
  const t = useTranslations("home");
  const d = useTranslations("diagram");
  const descriptions = t.raw("layers") as string[];

  const layers: StackLayer[] = [
    {
      label: "Spec",
      detail: "manifest.yaml",
      body: (
        <div className={s.code}>
          <div>
            <span className={s.k}>service</span>: <span className={s.v}>orders</span>
          </div>
          <div>
            <span className={s.k}>contracts</span>: <span className={s.v}>openapi</span>
          </div>
          <div>
            <span className={s.k}>invariants</span>: <span className={s.v}>12</span>
          </div>
        </div>
      ),
    },
    {
      label: "Contracts",
      detail: "OpenAPI · AsyncAPI",
      body: (
        <div className={s.code}>
          <div>
            <span className={s.method}>GET</span>/orders/{"{id}"}
          </div>
          <div>
            <span className={s.method}>POST</span>/orders
          </div>
          <div>
            <span className={s.method}>EVT</span>order.created
          </div>
        </div>
      ),
    },
    {
      label: "Code",
      detail: "generated · .NET",
      body: (
        <div className={s.bars}>
          {CODE_BARS.map((width, i) => (
            <span key={i} style={{ width: `${width}%` }} />
          ))}
        </div>
      ),
    },
    {
      label: "Verify",
      detail: "specdrift",
      body: (
        <div className={s.verify}>
          <div className={s.checks}>
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <span className={s.ok}>0 drift</span>
        </div>
      ),
    },
    {
      label: "Runtime",
      detail: "OpenTelemetry",
      body: (
        <svg className={s.spark} viewBox="0 0 120 32" preserveAspectRatio="none">
          <path d={SPARK} />
        </svg>
      ),
    },
  ].map((layer, i) => ({ ...layer, description: descriptions[i] }));

  return (
    <ArchitectureStack
      layers={layers}
      description={t("stackDescription")}
      legendLabel={d("layers")}
    />
  );
}
