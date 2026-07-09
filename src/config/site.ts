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
} as const;

export type SiteConfig = typeof site;
