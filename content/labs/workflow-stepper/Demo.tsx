"use client";

import { useState } from "react";

const STEPS = [
  { task: "Validate order", event: "order.received", system: "API" },
  { task: "Reserve resources", event: "inventory.reserved", system: "Inventory" },
  { task: "Provision service", event: "service.provisioned", system: "Network" },
  { task: "Activate & bill", event: "service.activated", system: "Billing" },
];

/** Placeholder demo: a process with its emitted events. */
export default function WorkflowStepperDemo() {
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  return (
    <div className="grid gap-0 sm:grid-cols-[1fr_1fr]">
      <div className="p-4">
        <p className="mono mb-3 text-caption text-faint">process · order #4821</p>
        <ol className="flex flex-col gap-2">
          {STEPS.map((s, i) => {
            const state = i < step ? "done" : i === step ? "current" : "todo";
            return (
              <li
                key={s.task}
                className={`flex items-center justify-between gap-3 rounded-[var(--radius-md)] border px-3 py-2 text-ui ${
                  state === "current"
                    ? "border-brand-accent text-foreground"
                    : state === "done"
                      ? "border-foreground text-foreground"
                      : "border-border text-muted-foreground"
                }`}
              >
                <span>{s.task}</span>
                <span className="mono text-caption text-muted-foreground">{s.system}</span>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
            disabled={done}
            className="h-8 rounded-[var(--radius-md)] border border-border px-3 text-ui font-medium text-foreground transition-colors hover:border-foreground disabled:opacity-50"
          >
            {done ? "Completed" : "Complete step"}
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="h-8 rounded-[var(--radius-md)] border border-border px-3 text-ui text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:border-s sm:border-t-0">
        <p className="mono mb-3 text-caption text-faint">events on the log</p>
        <div className="mono flex flex-col gap-1.5 text-caption">
          {STEPS.slice(0, step).map((s, i) => (
            <p key={s.event} className="flex justify-between gap-3 text-foreground">
              <span>{s.event}</span>
              <span className="text-muted-foreground">t+{(i + 1) * 120}ms</span>
            </p>
          ))}
          {step === 0 && <p className="text-muted-foreground">nothing yet — complete a step</p>}
        </div>
      </div>
    </div>
  );
}
