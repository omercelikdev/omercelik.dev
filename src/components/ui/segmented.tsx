"use client";

/** A segmented control: one choice among a few, shown as pills in a rail.
 *  Used to filter lists (Labs by topic, Work by sector). The chosen pill is
 *  filled; hover only changes colour. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-wrap gap-0.5 rounded-[var(--radius-lg)] border border-border p-0.5"
    >
      {options.map((option) => {
        const on = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(option.value)}
            className={`rounded-[var(--radius-md)] px-3 py-1.5 text-ui transition-colors ${
              on
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
