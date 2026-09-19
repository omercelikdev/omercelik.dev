import { ArrowUpRight } from "lucide-react";
import { features } from "@/config/features";

/** Products by Qorpe — behind `features.qorpe`. Returns nothing while the
 *  flag is off, so the static build never fetches from GitHub for it. */
export async function QorpeBand() {
  if (!features.qorpe) return null;

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-xl)] border border-border p-5">
        <div>
          <p className="text-body font-medium text-foreground">
            Products by Qorpe
          </p>
          <p className="max-w-xl text-ui text-muted-foreground">
            The tools behind the practice — spec lint, API sandbox, golden path
            and a CQRS mediator. Built from the same principles you read here.
          </p>
        </div>
        <a
          href="https://qorpe.com"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-ui font-medium text-foreground underline decoration-border underline-offset-[5px] transition-colors hover:decoration-foreground"
        >
          qorpe.com <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
