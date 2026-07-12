/** Curated list of repositories to surface as "products".
 *
 *  - `repo`      : the GitHub repo name under the site owner's account.
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
}

export const products: ProductEntry[] = [
  {
    repo: "goldpath",
    featured: true,
    accent: "violet",
    highlight:
      "AI-native, spec-driven enterprise .NET accelerator — composable libraries, templates, AI skills and guardrails on a paved golden path. Not a framework.",
  },
  {
    repo: "specdrift",
    featured: true,
    accent: "info",
    highlight:
      "Deterministic spec lint for manifest-driven golden paths — validates cross-artifact invariants and detects manifest-vs-repo drift, served over MCP. LLMs call it; it never calls an LLM.",
  },
  {
    repo: "mediant",
    featured: true,
    accent: "success",
  },
  {
    repo: "mockifyr",
    accent: "warning",
  },
  {
    repo: "socketr",
    accent: "info",
  },
  {
    repo: "qliplab",
    accent: "violet",
  },
];
