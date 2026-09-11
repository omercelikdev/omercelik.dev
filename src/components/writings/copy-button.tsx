"use client";

import { useState, type MouseEvent } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

/** Copies the neighbouring <pre>'s text. It reads the DOM at click time, so
 *  the server-rendered, highlighted block stays the only copy of the code. */
export function CopyButton() {
  const t = useTranslations("writings");
  const [copied, setCopied] = useState(false);

  async function copy(e: MouseEvent<HTMLButtonElement>) {
    const pre = e.currentTarget.parentElement?.querySelector("pre");
    if (!pre) return;
    await navigator.clipboard.writeText(pre.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const label = copied ? t("copied") : t("copy");
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      title={label}
      className="absolute end-2.5 top-2.5 grid size-8 place-items-center rounded-[var(--radius-md)] border border-border bg-background text-muted-foreground opacity-0 transition-opacity group-hover/code:opacity-100 hover:text-foreground focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
    >
      {copied ? (
        <Check className="size-3.5 text-success" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
