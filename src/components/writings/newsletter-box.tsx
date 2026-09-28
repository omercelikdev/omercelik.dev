import { useTranslations } from "next-intl";
import { site } from "@/config/site";

/** The newsletter invitation, under the writing list and at the end of an
 *  essay. Hidden until `site.links.newsletter` is set. */
export function NewsletterBox() {
  const t = useTranslations("newsletter");
  if (!site.links.newsletter) return null;
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[var(--radius-xl)] border border-border px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-foreground">{t("title")}</p>
        <p className="text-ui text-muted-foreground">{t("blurb")}</p>
      </div>
      <a
        href={site.links.newsletter}
        target="_blank"
        rel="noreferrer noopener"
        className="h-8 rounded-[var(--radius-md)] border border-border px-3 text-ui font-medium leading-8 text-foreground transition-colors hover:border-foreground"
      >
        {t("cta")}
      </a>
    </div>
  );
}
