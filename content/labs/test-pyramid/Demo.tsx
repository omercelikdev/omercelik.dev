"use client";

import { useId, useState } from "react";

const LAYERS = [
  { name: "Unit", detail: "cheap, many", before: 70, after: 30 },
  { name: "Contract", detail: "what you promised", before: 10, after: 30 },
  { name: "Integration", detail: "something real", before: 15, after: 25 },
  { name: "Production signals", detail: "what actually happened", before: 5, after: 15 },
];

/** Placeholder demo: the mix of evidence as code gets cheaper. */
export default function TestPyramidDemo() {
  const [cost, setCost] = useState(100);
  const id = useId();
  const t = 1 - cost / 100;

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-[1fr_220px]">
      <div className="flex flex-col gap-2">
        {LAYERS.map((l) => {
          const share = Math.round(l.before + (l.after - l.before) * t);
          const moved = l.after > l.before;
          return (
            <div key={l.name} className="grid grid-cols-[150px_1fr_40px] items-center gap-3 text-ui">
              <span>
                <span className="block font-medium text-foreground">{l.name}</span>
                <span className="block text-caption text-muted-foreground">{l.detail}</span>
              </span>
              <span className="h-6 overflow-hidden rounded-[var(--radius-sm)] border border-border">
                <span
                  className={`block h-full transition-[width] duration-300 ${moved && t > 0.3 ? "bg-brand-accent" : "bg-foreground"}`}
                  style={{ width: `${share}%` }}
                />
              </span>
              <span className="mono text-end text-caption text-muted-foreground">{share}%</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4 sm:border-s sm:border-t-0 sm:ps-4 sm:pt-0">
        <label htmlFor={id} className="text-ui font-medium text-foreground">
          Cost of writing code
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          className="accent-[var(--brand-accent)]"
        />
        <p className="mono text-caption text-muted-foreground">
          {cost === 100 ? "today" : cost === 0 ? "near zero" : `${cost}% of today`}
        </p>
        <p className="text-caption text-muted-foreground">
          As writing gets cheaper, evidence that touches something real carries more of the trust.
        </p>
      </div>
    </div>
  );
}
