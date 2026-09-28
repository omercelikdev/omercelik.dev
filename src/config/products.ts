/** Curated list of repositories to surface as "products".
 *
 *  - `name`      : optional display name (the repo name is lowercase).
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
  /** Display name, spelled as the project writes it (repo names are lowercase). */
  name?: string;
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
    name: "Goldpath",
    featured: true,
    accent: "violet",
    highlight:
      "AI-native, spec-driven enterprise .NET accelerator — composable libraries, templates, AI skills and guardrails on a paved golden path. Not a framework.",
  },
  {
    repo: "qorpe/specdrift",
    name: "SpecDrift",
    featured: true,
    accent: "info",
    highlight:
      "Deterministic spec lint for manifest-driven golden paths — validates cross-artifact invariants and detects manifest-vs-repo drift, served over MCP. LLMs call it; it never calls an LLM.",
  },
  {
    repo: "qorpe/mediant",
    name: "Mediant",
    featured: true,
    accent: "success",
  },
  {
    repo: "qorpe/mockifyr",
    name: "Mockifyr",
    accent: "warning",
  },
  {
    repo: "qliplab",
    name: "QlipLab",
    accent: "violet",
  },
];
