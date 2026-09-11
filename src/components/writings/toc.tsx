import type { Heading } from "@/lib/writings";

/** Table of contents for an article: h2s, with h3s indented beneath them.
 *  Plain in-page links — the rendered headings carry matching ids. */
export function Toc({
  headings,
  label,
  className = "",
}: {
  headings: Heading[];
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-col gap-2 border-s border-border">
        {headings.map((h) => (
          <li key={h.id} className={h.depth === 3 ? "ps-6" : "ps-3.5"}>
            <a
              href={`#${h.id}`}
              className="block text-ui text-muted-foreground transition-colors hover:text-foreground"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
