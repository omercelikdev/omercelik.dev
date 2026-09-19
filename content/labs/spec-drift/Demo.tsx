"use client";

import { useState } from "react";

/** Placeholder demo — the real one will read a manifest and run the same
 *  checks as the spec-lint tool. Mock data only; nothing leaves the page. */
export default function SpecDriftDemo() {
  const [extraInvariant, setExtraInvariant] = useState(false);
  const [optionalIdem, setOptionalIdem] = useState(false);
  const fail = extraInvariant || optionalIdem;

  const checks = [
    { ok: true, text: "contracts match manifest" },
    {
      ok: !extraInvariant,
      text: extraInvariant
        ? "12 / 13 invariants covered — one has no test"
        : "12 / 12 invariants covered",
    },
    {
      ok: !optionalIdem,
      text: optionalIdem
        ? "idempotency no longer enforced on POST — contract drift"
        : "idempotency enforced on POST",
    },
  ];

  return (
    <div className="grid gap-0 sm:grid-cols-2">
      <div className="p-4">
        <p className="mono mb-2 text-caption text-faint">manifest.yaml</p>
        <pre className="mono text-ui leading-7 text-foreground">
          <Line k="service" v="orders" />
          <Line k="contracts" v="openapi" />
          <Line k="invariants" v={extraInvariant ? "13" : "12"} changed={extraInvariant} />
          <Line k="idempotency" v={optionalIdem ? "optional" : "required"} changed={optionalIdem} />
          <Line k="telemetry" v="otel" />
        </pre>
      </div>
      <div className="border-t border-border p-4 sm:border-s sm:border-t-0">
        <p className="mono mb-2 text-caption text-faint">gate</p>
        <div className="flex flex-col gap-2 text-ui">
          {checks.map((c) => (
            <Check key={c.text} ok={c.ok}>
              {c.text}
            </Check>
          ))}
          <Check ok={!fail}>
            result:{" "}
            <b className="font-medium">
              {fail ? "fail — merge blocked" : "pass"}
            </b>
          </Check>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3 text-ui text-muted-foreground sm:col-span-2">
        <span>Change the manifest:</span>
        <label className="flex cursor-pointer items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={extraInvariant}
            onChange={(e) => setExtraInvariant(e.target.checked)}
          />
          add an invariant
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={optionalIdem}
            onChange={(e) => setOptionalIdem(e.target.checked)}
          />
          make idempotency optional
        </label>
      </div>
    </div>
  );
}

function Line({ k, v, changed }: { k: string; v: string; changed?: boolean }) {
  return (
    <span className="block">
      <span className="text-muted-foreground">{k}: </span>
      <span
        className={
          changed
            ? "rounded-[3px] bg-brand-accent px-1 text-primary-foreground"
            : ""
        }
      >
        {v}
      </span>
    </span>
  );
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p
      className={`flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 ${
        ok ? "border-border text-muted-foreground" : "border-brand-accent text-foreground"
      }`}
    >
      <span
        aria-hidden
        className={`size-2 flex-none rounded-full ${ok ? "bg-foreground" : "bg-brand-accent"}`}
      />
      <span>{children}</span>
    </p>
  );
}
