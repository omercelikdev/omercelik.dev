"use client";

import { useState } from "react";

type Actor = "person" | "system" | "engine" | "downstream";

type Step = {
  task: string;
  actor: Actor;
  /** What completes the step, as the button reads while it is current. */
  action: string;
  events: string[];
};

/** A generic order, end to end: the shape of the flow, none of a client's names. */
const STEPS: Step[] = [
  { task: "Quote submitted", actor: "person", action: "Submit quote", events: ["quote.submitted"] },
  {
    task: "Decomposed into product orders",
    actor: "system",
    action: "Decompose",
    events: ["product-order.created #1", "product-order.created #2"],
  },
  { task: "One process per product order", actor: "engine", action: "Start process", events: ["process.started #1"] },
  { task: "Service order created", actor: "engine", action: "Create service order", events: ["service-order.created"] },
  { task: "Reserve network resources", actor: "downstream", action: "Receive callback", events: ["callback resource.reserved"] },
  { task: "Confirm technical details", actor: "person", action: "Complete task", events: ["task.completed"] },
  { task: "Activate and start billing", actor: "downstream", action: "Receive callback", events: ["callback billing.started"] },
  { task: "Product order completed", actor: "engine", action: "Complete", events: ["product-order.completed #1"] },
];

/** From this step on, the order can no longer be cancelled. */
const MILESTONE = 6;

const ACTOR_LABEL: Record<Actor, string> = {
  person: "people",
  system: "system",
  engine: "engine",
  downstream: "callback",
};

type LogLine = { event: string; tone?: "reject" | "stop" };

/** One product order stepped through its process, with the events it emits
 *  and a cancellation that only holds before the point of no return. */
export default function WorkflowStepperDemo() {
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [cancelled, setCancelled] = useState(false);

  const done = step >= STEPS.length;
  const stopped = done || cancelled;
  const current = STEPS[step];

  function advance() {
    if (stopped) return;
    setLog((l) => [...l, ...current.events.map((event) => ({ event }))]);
    setStep((s) => s + 1);
  }

  function cancel() {
    if (stopped) return;
    if (step < MILESTONE) {
      setCancelled(true);
      setLog((l) => [
        ...l,
        { event: "cancel.requested" },
        { event: "product-order.cancelled #1", tone: "stop" },
      ]);
    } else {
      setLog((l) => [...l, { event: "cancel.rejected · past milestone", tone: "reject" }]);
    }
  }

  function reset() {
    setStep(0);
    setLog([]);
    setCancelled(false);
  }

  return (
    <div className="grid gap-0 sm:grid-cols-[1fr_1fr]">
      <div className="p-4">
        <p className="mono mb-3 text-caption text-faint">product order #1 · its process</p>
        <ol className="flex flex-col gap-1.5">
          {STEPS.map((s, i) => {
            const state =
              i < step ? "done" : i === step && !stopped ? "current" : "todo";
            return (
              <li key={s.task}>
                {i === MILESTONE && (
                  <p className="mono my-1 text-caption text-faint">— milestone: no cancel after this —</p>
                )}
                <div
                  className={`flex items-center justify-between gap-3 rounded-[var(--radius-md)] border px-3 py-1.5 text-ui ${
                    state === "current"
                      ? "border-brand-accent text-foreground"
                      : state === "done"
                        ? "border-foreground text-foreground"
                        : "border-border text-muted-foreground"
                  } ${cancelled && i >= step ? "line-through" : ""}`}
                >
                  <span>{s.task}</span>
                  <span className="mono shrink-0 text-caption text-muted-foreground">
                    {ACTOR_LABEL[s.actor]}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={advance}
            disabled={stopped}
            className="h-8 rounded-[var(--radius-md)] border border-border px-3 text-ui font-medium text-foreground transition-colors hover:border-foreground disabled:opacity-50"
          >
            {cancelled ? "Cancelled" : done ? "Completed" : current.action}
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={stopped || step === 0}
            className="h-8 rounded-[var(--radius-md)] border border-border px-3 text-ui text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50"
          >
            Cancel while running
          </button>
          <button
            type="button"
            onClick={reset}
            className="h-8 rounded-[var(--radius-md)] border border-border px-3 text-ui text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:border-s sm:border-t-0">
        <p className="mono mb-3 text-caption text-faint">events, in order</p>
        <div className="mono flex flex-col gap-1.5 text-caption">
          {log.map((line, i) => (
            <p
              key={`${line.event}-${i}`}
              className={`flex justify-between gap-3 ${
                line.tone === "reject"
                  ? "text-muted-foreground"
                  : line.tone === "stop"
                    ? "text-brand-accent"
                    : "text-foreground"
              }`}
            >
              <span>{line.event}</span>
              <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            </p>
          ))}
          {log.length === 0 && <p className="text-muted-foreground">nothing yet — submit the quote</p>}
        </div>
      </div>
    </div>
  );
}
