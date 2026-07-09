import type { MDXComponents } from "mdx/types";

/** Styled elements for rendered MDX articles. Code blocks are highlighted by
 *  rehype-pretty-code (dual-theme Shiki); see globals.css for the token wiring. */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-10 scroll-mt-24 text-xl font-semibold tracking-[-0.015em]"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-24 text-base font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mt-4 text-[15px] leading-7 text-foreground/90" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-violet underline decoration-violet-border underline-offset-2 transition-colors hover:decoration-violet"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 ps-6 text-[15px] leading-7" {...props} />
  ),
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 ps-6 text-[15px] leading-7"
      {...props}
    />
  ),
  li: (props) => <li className="marker:text-faint" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-5 border-s-2 border-violet-border ps-4 text-[15px] italic text-muted-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  code: (props) => (
    <code
      className="mono rounded-[var(--radius-sm)] bg-muted px-1.5 py-0.5 text-[0.85em] font-semibold before:content-none after:content-none"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mono mt-5 overflow-x-auto rounded-[var(--radius-xl)] border border-border bg-background p-4 text-[13px] leading-6 shadow-[var(--shadow-surface)]"
      {...props}
    />
  ),
  table: (props) => (
    <div className="mt-5 overflow-x-auto rounded-[var(--radius-xl)] border border-border">
      <table className="w-full border-collapse text-[13px]" {...props} />
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
    <img className="mt-5 rounded-[var(--radius-xl)] border border-border" alt="" {...props} />
  ),
};
