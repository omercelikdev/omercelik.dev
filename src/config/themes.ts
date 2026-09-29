/** The practice areas the site is organised by. Work, and later writing and
 *  labs, are grouped under these; employers and clients never are. A case
 *  lists one or two themes, the first being where it is shown.
 *
 *  Order here is the display order. Slugs are part of URLs and anchors, so
 *  treat them as permanent.
 */
export const THEMES = [
  {
    slug: "architecture-integration",
    title: "Architecture & integration",
    summary:
      "Service boundaries, platform foundations, gateways and the contracts between systems.",
  },
  {
    slug: "workflow-orchestration",
    title: "Workflow orchestration",
    summary:
      "Long-running processes, asynchronous callbacks, human tasks and bulk operations.",
  },
  {
    slug: "domain-modeling-rules",
    title: "Domain modeling & rules",
    summary: "Catalogs, industry standards and business rule engines.",
  },
  {
    slug: "legacy-modernization",
    title: "Legacy modernization",
    summary:
      "Running old and new side by side, keeping data in step, and cutting over in phases.",
  },
  {
    slug: "quality-test-strategy",
    title: "Quality & test strategy",
    summary: "Test strategy strong enough to decide what reaches production.",
  },
  {
    slug: "delivery-operations",
    title: "Delivery & operations",
    summary:
      "CI/CD, environments, logging, backups and running what was built.",
  },
] as const;

export type ThemeSlug = (typeof THEMES)[number]["slug"];

export const THEME_SLUGS: readonly string[] = THEMES.map((t) => t.slug);

export function getTheme(slug: string) {
  return THEMES.find((t) => t.slug === slug);
}
