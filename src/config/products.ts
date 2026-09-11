/** Curated list of repositories to surface as "products".
 *
 *  - `repo`      : the GitHub repo — a bare name for one under the site owner's
 *                  account, or "owner/name" for one elsewhere (an organisation).
 *  - `featured`  : show on the home page's featured strip (top 3 by order).
 *  - `highlight` : optional override for the card blurb (falls back to the
 *                  repo's GitHub description). Use it for repos with no/short
 *                  GitHub description. Keep it short and punchy.
 *  - `accent`    : semantic accent used for the card's language dot.
 *
 *  Order here is the display order.
 */
export type ProductAccent = "violet" | "info" | "success" | "warning";

export interface ProductEntry {
  repo: string;
  featured?: boolean;
  highlight?: string;
  accent?: ProductAccent;
  /** Override the project's own site (used by the card's "visit" arrow).
   *  Falls back to the repo's GitHub `homepage` field when omitted. */
  site?: string;
}

export const products: ProductEntry[] = [
  {
    repo: "qorpe/goldpath",
    featured: true,
    accent: "violet",
    highlight:
      "AI-native, spec-driven enterprise .NET accelerator — composable libraries, templates, AI skills and guardrails on a paved golden path. Not a framework.",
  },
  {
    repo: "qorpe/specdrift",
    featured: true,
    accent: "info",
    highlight:
      "Deterministic spec lint for manifest-driven golden paths — validates cross-artifact invariants and detects manifest-vs-repo drift, served over MCP. LLMs call it; it never calls an LLM.",
  },
  {
    repo: "qorpe/mediant",
    featured: true,
    accent: "success",
  },
  {
    repo: "qorpe/mockifyr",
    accent: "warning",
  },
  {
    repo: "qliplab",
    accent: "violet",
  },
];
