import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { CopyButton } from "./copy-button";
import { Callout, Figure } from "./mdx-blocks";

/** Styled elements for rendered MDX articles. Code blocks are highlighted by
 *  rehype-pretty-code (dual-theme Shiki); see globals.css for the token wiring.
 *  Reading size is `text-prose` (17px / 1.75). */

const HEADING = "group scroll-mt-24 font-semibold text-foreground";

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className={`${HEADING} mt-12 text-h2`} {...props} />,
  h3: (props) => (
    <h3 className={`${HEADING} mt-9 text-h3 tracking-tight`} {...props} />
  ),
  p: (props) => <p className="mt-5 text-prose text-foreground/90" {...props} />,
  a: ({ className = "", ...props }: ComponentProps<"a">) =>
    // rehype-autolink-headings appends a "#" anchor to every heading; it shows
    // on hover instead of dressing the heading up as a link.
    className.includes("heading-anchor") ? (
      <a
        className="heading-anchor ms-2 font-normal text-faint no-underline opacity-0 transition-opacity group-hover:opacity-100"
        {...props}
      />
    ) : (
      <a
        className={`font-medium text-foreground underline decoration-border-strong decoration-1 underline-offset-[5px] transition-colors hover:decoration-foreground ${className}`}
        {...props}
      />
    ),
  ul: (props) => (
    <ul className="mt-5 list-disc space-y-2 ps-6 text-prose" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-5 list-decimal space-y-2 ps-6 text-prose" {...props} />
  ),
  li: (props) => <li className="ps-1 marker:text-faint" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-s-2 border-border-strong ps-5 [&>p]:text-muted-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
  code: ({ className = "", ...props }: ComponentProps<"code">) =>
    // Block code arrives from rehype-pretty-code tagged with data-language and
    // is styled by its <pre>; only inline code gets the pill treatment.
    "data-language" in props ? (
      <code className={className} {...props} />
    ) : (
      <code
        className={`mono rounded-[var(--radius-sm)] border border-border bg-muted px-1.5 py-0.5 text-[0.85em] ${className}`}
        {...props}
      />
    ),
  pre: ({ className = "", children, ...props }: ComponentProps<"pre">) => (
    <div className="code-block group/code relative mt-6">
      <pre
        className={`mono overflow-x-auto rounded-[var(--radius-xl)] border border-border bg-background py-4 text-ui leading-6 ${className}`}
        {...props}
      >
        {children}
      </pre>
      <CopyButton />
    </div>
  ),
  table: (props) => (
    <div className="mt-6 overflow-x-auto rounded-[var(--radius-xl)] border border-border">
      <table className="w-full border-collapse text-ui" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border bg-muted px-3 py-2 text-start font-semibold"
      {...props}
    />
  ),
  td: (props) => <td className="border-t border-border px-3 py-2" {...props} />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="mt-6 rounded-[var(--radius-xl)] border border-border" alt="" {...props} />
  ),
  Callout,
  Figure,
};
