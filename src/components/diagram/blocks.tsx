/** Still diagrams for essays and case studies. Plain string props only — the
 *  MDX pipeline doesn't evaluate expressions. Items are separated by "|". */

const split = (s: string) =>
  s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);

/** Two ways side by side; the second is the one being argued for. In MDX:
 *  <Compare
 *    before="Spec in someone's head | Tests written last | Trust by review"
 *    after="Manifest as the source of truth | Gates that can't be bypassed silently | Trust by evidence"
 *    beforeTitle="Before" afterTitle="Intent → proof" /> */
export function Compare({
  before,
  after,
  beforeTitle = "Before",
  afterTitle = "After",
}: {
  before: string;
  after: string;
  beforeTitle?: string;
  afterTitle?: string;
}) {
  const side = (title: string, items: string[], hot: boolean) => (
    <div
      className={`rounded-[var(--radius-xl)] border p-4 ${hot ? "border-brand-accent" : "border-border"}`}
    >
      <p className="mb-2 text-ui font-medium text-foreground">{title}</p>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <p key={item} className="text-ui text-muted-foreground">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      {side(beforeTitle, split(before), false)}
      {side(afterTitle, split(after), true)}
    </div>
  );
}

/** A 2×2 decision matrix. `cells` run top-left, top-right, bottom-left,
 *  bottom-right; `highlight` (1–4) marks the quadrant the text recommends.
 *  <Matrix x="Spec changes rarely | Spec changes weekly" y="Few consumers | Many consumers"
 *          cells="Hand-written contracts | Generated contracts | Generated contracts | Spec-driven + drift gate" highlight="4" /> */
export function Matrix({
  x,
  y,
  cells,
  highlight,
}: {
  x: string;
  y: string;
  cells: string;
  highlight?: string;
}) {
  const [x1, x2] = split(x);
  const [y1, y2] = split(y);
  const c = split(cells);
  const hot = Number(highlight);
  return (
    <div className="my-8 grid grid-cols-[auto_1fr_1fr] gap-2 text-ui">
      <span />
      <span className="mono text-center text-caption text-muted-foreground">
        {x1}
      </span>
      <span className="mono text-center text-caption text-muted-foreground">
        {x2}
      </span>
      {[y1, y2].map((label, r) => (
        <Row key={label} label={label}>
          {[0, 1].map((col) => {
            const i = r * 2 + col;
            return (
              <div
                key={i}
                className={`min-h-20 rounded-[var(--radius-lg)] border p-3 ${
                  hot === i + 1
                    ? "border-brand-accent text-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {c[i]}
              </div>
            );
          })}
        </Row>
      ))}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="mono self-center pe-1 text-caption text-muted-foreground [writing-mode:vertical-rl] [transform:rotate(180deg)] sm:[writing-mode:horizontal-tb] sm:[transform:none]">
        {label}
      </span>
      {children}
    </>
  );
}

/** Stages in time, top to bottom. Each item is "when: title: one line".
 *  <Timeline items="Q1: Contracts first: every service gets a spec | Q2: Gate in CI: drift fails the build" /> */
export function Timeline({ items }: { items: string }) {
  const rows = split(items).map((item) => {
    const [when, title, ...rest] = item.split(":").map((s) => s.trim());
    return { when, title, detail: rest.join(":") };
  });
  return (
    <div className="my-8 border-s border-border ps-5">
      {rows.map((row) => (
        <div key={row.when + row.title} className="relative pb-6 last:pb-0">
          <span
            aria-hidden
            className="absolute -start-[25px] top-1.5 size-2 rounded-full border border-foreground bg-surface"
          />
          <p className="mono text-caption text-muted-foreground">{row.when}</p>
          <p className="text-body font-medium text-foreground">{row.title}</p>
          {row.detail && (
            <p className="text-ui text-muted-foreground">{row.detail}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/** A system at a glance: columns left to right (top to bottom on phones),
 *  each "Title: item; item; item". Items starting with "*" are highlighted,
 *  and `legend` says what the highlight means.
 *  <SystemMap title="The platform" legend="Built by me"
 *    columns="People: Order entry; Catalog screens | Entry: *Gateway | Services: Orders; Catalog; Rules" /> */
export function SystemMap({
  title,
  columns,
  legend,
}: {
  title?: string;
  columns: string;
  legend?: string;
}) {
  const cols = split(columns).map((col) => {
    const [head, ...rest] = col.split(":");
    const items = rest
      .join(":")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) =>
        s.startsWith("*")
          ? { label: s.slice(1).trim(), hot: true }
          : { label: s, hot: false },
      );
    return { head: head.trim(), items };
  });
  return (
    <figure className="my-8 rounded-[var(--radius-xl)] border border-border p-4">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {cols.map((col, i) => (
          <div key={col.head} className="contents">
            {i > 0 && (
              <span
                aria-hidden
                className="mono self-center text-caption text-faint sm:px-0.5"
              >
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="mono text-caption text-muted-foreground">
                {col.head}
              </p>
              {col.items.map((item) => (
                <p
                  key={item.label}
                  className={`rounded-[var(--radius-md)] border px-2.5 py-1.5 text-ui ${
                    item.hot
                      ? "border-brand-accent bg-brand-accent-soft text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {item.label}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      {(title || legend) && (
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-caption text-muted-foreground">
          <span>{title}</span>
          {legend && (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="size-2.5 rounded-sm border border-brand-accent bg-brand-accent-soft"
              />
              {legend}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
