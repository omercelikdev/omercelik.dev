import { useTranslations } from "next-intl";
import { Rss } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";

/** Byline at the end of an article: who wrote it, and where to follow. */
export function AuthorCard() {
  const t = useTranslations("writings");
  const footer = useTranslations("footer");

  const follow = [
    { href: site.links.github, label: "GitHub", Icon: GithubIcon, external: true },
    { href: site.links.x, label: "X", Icon: XIcon, external: true },
    { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    { href: "/feed.xml", label: footer("rss"), Icon: Rss, external: false },
  ];

  return (
    <div className="mt-16 flex items-start gap-4 rounded-[var(--radius-xl)] border border-border p-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/omer.jpg"
        alt=""
        width={48}
        height={48}
        className="size-12 flex-none rounded-full border border-border object-cover grayscale"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="mono text-meta uppercase tracking-wider text-faint">
          {t("writtenBy")}
        </span>
        <Link
          href="/about"
          className="w-fit text-body font-medium text-foreground decoration-1 underline-offset-[5px] hover:underline"
        >
          {site.name}
        </Link>
        <p className="text-ui text-muted-foreground">{footer("tagline")}</p>
        <div className="-ms-2 mt-1.5 flex items-center gap-0.5">
          {follow.map(({ href, label, Icon, external }) => (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer noopener" : undefined}
              aria-label={label}
              title={label}
              className="grid size-8 place-items-center rounded-[var(--radius-md)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
