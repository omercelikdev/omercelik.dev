import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Small uppercase kicker above a heading. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-faint">
      {children}
    </span>
  );
}

/** Section header with an optional "view all" link on the trailing side. */
export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold tracking-[-0.015em] sm:text-xl">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-prose text-[13px] text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex flex-none items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {action.label}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}
