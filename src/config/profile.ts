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
  headline:
    "Lead Developer | Enterprise systems architecture · Governed AI in software delivery",
  /** The three proof tiles under the hero thesis. Written to stay true over
   *  time: no counts that age (years, service lines). */
  facts: [
    { value: "Since 2018", label: "enterprise software on .NET" },
    {
      value: "10+",
      label: "engineers led across two teams",
      countTo: 10,
      suffix: "+",
    },
    { value: "5", label: "open source tools shipped", countTo: 5 },
  ] as Fact[],
  /** Experience, newest first. Same facts as LinkedIn and the CV. */
  roles: [
    {
      from: "2024",
      to: "now",
      title: "Lead Developer",
      org: "DefineX",
      context: "Consulting, Technology & Labs",
      summary:
        "Leading a large, multi-year order management transformation for a telecom operator: a legacy Conceptwave-based B2B ordering stack replaced with .NET microservices, one service line at a time. I lead both teams, 10+ engineers in total, and own the technical design from the Vue.js interface and API gateway to the ASP.NET Core services, Camunda workflows and Kafka messaging. I set up the platform's foundation, from the structure of every service and the implementation templates to the shared building blocks and the .NET Aspire environment the team develops in, and contribute across all of its modules. Cut-overs ship on schedule without disrupting live order flows.",
    },
    {
      from: "2021",
      to: "2024",
      title: "Senior Developer",
      org: "DefineX",
      context: "Consulting, Technology & Labs",
      summary:
        "Full stack .NET developer on telecom B2B systems, delivering features from design to production across ASP.NET Core Web APIs, Entity Framework Core, Vue.js and integrations with connected systems.",
    },
    {
      from: "2019",
      to: "2021",
      title: "Developer",
      org: "DefineX",
      context: "Consulting, Technology & Labs",
      summary:
        "Full stack development on telecom projects with .NET, C#, JavaScript, TypeScript and Vue.js.",
    },
    {
      from: "2018",
      to: "2019",
      title: "Developer",
      org: "Accenture",
      context: "İzmir",
      summary:
        "First industry role: telecom ordering on Conceptwave, with .NET, Vue.js and JavaScript.",
    },
  ] as Role[],
  toolbox: [
    "C# / .NET",
    "ASP.NET Core",
    "Camunda · BPM",
    "Kafka",
    "PostgreSQL · Oracle",
    "Vue 3 · TypeScript",
    "OpenShift · Kubernetes",
    "OpenTelemetry",
    "Conceptwave",
    "MCP · Claude Code",
  ],
  education: "Yıldız Technical University · B.Sc. Computer Engineering, 2018",
  /** The public CV: same text as the full CV, without the phone number. */
  cvUrl: "/cv.pdf" as string | null,
} as const;
