/** Site-wide configuration. Edit these values to your own. */
export const site = {
  name: "Ömer Çelik",
  domain: "omercelik.dev",
  url: "https://omercelik.dev",
  email: "omer@omercelik.dev",
  githubUsername: "omercelikdev",
  /** Social / contact links shown in the footer and About page. */
  links: {
    github: "https://github.com/omercelikdev",
    x: "https://x.com/omercelikdev",
    linkedin: "https://www.linkedin.com/in/omercelikdev",
    email: "mailto:omer@omercelik.dev",
  },
  /** Comments on writing via Giscus (GitHub Discussions — free, no backend).
   *  Enable Discussions on the repo, install the giscus app, then paste the
   *  repoId + categoryId from https://giscus.app. Comments render only once
   *  both IDs are filled in. */
  comments: {
    repo: "omercelikdev/omercelik.dev",
    repoId: "",
    category: "Comments",
    categoryId: "",
  },
} as const;

export type SiteConfig = typeof site;
