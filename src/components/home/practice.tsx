import { getTranslations } from "next-intl/server";
import Link from "next/link";

/** What I'm hired for, as rows: name, one line, and the work that proves
 *  it. Text darkens on hover; nothing moves. */
export async function Practice() {
  const t = await getTranslations("home");
  const items = t.raw("practice") as {
    title: string;
    desc: string;
    href: string;
    proof: string;
  }[];

  return (
    <div className="grid border-t border-border sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto]">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group grid gap-1.5 border-b border-border py-4 sm:col-span-3 sm:grid-cols-subgrid sm:items-baseline sm:gap-6"
        >
          <span className="text-body font-medium text-foreground">
            {item.title}
          </span>
          <span className="text-ui text-muted-foreground transition-colors group-hover:text-foreground">
            {item.desc}
          </span>
          <span className="mono text-caption text-muted-foreground underline decoration-border underline-offset-4 transition-colors group-hover:text-foreground group-hover:decoration-foreground sm:text-end">
            {item.proof}
          </span>
        </Link>
      ))}
    </div>
  );
}
