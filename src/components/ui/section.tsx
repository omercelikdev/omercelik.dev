import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Monospace section header: "01 / label" on the lead side, optional link on
 *  the trailing side. Matches the reference's quiet, indexed sections. */
export function SectionHead({
  index,
  label,
  action,
}: {
  index: string;
  label: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-border pb-4">
      <span className="mono text-ui text-muted-foreground">
        <span className="text-faint">{index}</span> / {label}
      </span>
      {action && (
        <Link
          href={action.href}
          className="group mono inline-flex items-center gap-1 text-caption text-muted-foreground transition-colors hover:text-foreground"
        >
          {action.label}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
