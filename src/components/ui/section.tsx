import Link from "next/link";

/** A section's title, one line of intent under it, and an optional link to
 *  the full list. No numbering: the sections aren't a sequence. */
export function SectionHead({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6">
      <div className="min-w-0">
        <h2 className="text-h2 font-medium tracking-tight">{title}</h2>
        {intro && (
          <p className="mt-1 max-w-xl text-ui text-muted-foreground">{intro}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="flex-none text-ui text-muted-foreground underline decoration-border decoration-1 underline-offset-[5px] transition-colors hover:text-foreground hover:decoration-foreground"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
