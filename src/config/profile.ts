/** The facts the site states about its author. Placeholders are marked
 *  `todo: true` and render nowhere in production — the build fails on them
 *  (see profile.test.ts), so a half-filled profile never ships. */

export interface Fact {
  /** The number or short phrase shown large ("10+", "Telco · Banking"). */
  value: string;
  /** What it counts, one short line. */
  label: string;
  /** When set, the value counts up from zero as it scrolls into view. */
  countTo?: number;
  suffix?: string;
  todo?: boolean;
}

export interface Role {
  from: string;
  to: string;
  title: string;
  org: string;
  /** Sector or unit, one line under the title. */
  context: string;
  /** One paragraph, outcomes first — never a bullet list. */
  summary: string;
  todo?: boolean;
}

export const profile = {
  headline: "Software architect · Lead .NET engineer · AI-assisted delivery",
  /** The three proof tiles under the hero thesis. */
  facts: [
    // Since August 2018 (Accenture), counted from LinkedIn.
    { value: "8", label: "years, enterprise .NET", countTo: 8 },
    { value: "Telco · Banking", label: "regulated domains" },
    {
      value: "5",
      label: "AI & platform tools shipped",
      countTo: 5,
      todo: true,
    },
  ] as Fact[],
  /** Experience, newest first. */
  roles: [
    {
      from: "2024",
      to: "now",
      title: "Lead Developer",
      org: "DefineX",
      context: "Consulting, Technology & Labs",
      summary:
        "Leading architecture and delivery of a service orchestration platform in the telco domain — .NET, Camunda and Kafka on OpenShift. Introduced AI-assisted quality engineering (generated end-to-end tests, log digests, environment diffs) and an enterprise .NET golden path the company now uses as an asset.",
    },
    {
      from: "2021",
      to: "2024",
      title: "Senior Developer",
      org: "DefineX",
      context: "Consulting, Technology & Labs",
      summary:
        "Enterprise .NET delivery for telco and banking clients: services, integrations and the platform work underneath them. Outcomes to be written from the projects of these years.",
      todo: true,
    },
    {
      from: "2019",
      to: "2021",
      title: "Developer",
      org: "DefineX",
      context: "Consulting, Technology & Labs",
      summary:
        "Full-stack .NET development on enterprise projects. Outcomes to be written.",
      todo: true,
    },
    {
      from: "2018",
      to: "2019",
      title: "Developer",
      org: "Accenture",
      context: "İzmir",
      summary:
        "First industry role: .NET development on client projects. Outcomes to be written.",
      todo: true,
    },
  ] as Role[],
  toolbox: [
    "C# / .NET 10",
    "Aspire",
    "Camunda",
    "Kafka",
    "PostgreSQL",
    "OpenTelemetry",
    "OpenAPI · AsyncAPI",
    "CQRS · DDD",
    "Playwright",
    "Next.js · Vue 3",
    "MCP · Claude Code",
  ],
  education: "Yıldız Technical University",
  /** Set to "/cv.pdf" once the file is in public/. */
  cvUrl: null as string | null,
} as const;
