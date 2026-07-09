/** Curated list of repositories to surface as "products".
 *
 *  - `repo`      : the GitHub repo name under the site owner's account.
 *  - `featured`  : show on the home page's featured strip.
 *  - `highlight` : optional override for the card blurb (falls back to the
 *                  repo's GitHub description). Keep it short and punchy.
 *  - `accent`    : semantic accent used for the card's icon tile.
 *
 *  Order here is the display order. Leave the array empty to auto-list the
 *  owner's public, non-fork repos by star count (see lib/github.ts).
 */
export type ProductAccent = "violet" | "info" | "success" | "warning";

export interface ProductEntry {
  repo: string;
  featured?: boolean;
  highlight?: string;
  accent?: ProductAccent;
}

export const products: ProductEntry[] = [
  { repo: "mockifyr", featured: true, accent: "violet" },
  // Add more, e.g. { repo: "another-project", featured: true, accent: "info" },
];
