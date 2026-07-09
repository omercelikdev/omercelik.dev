"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/config/site";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-[var(--radius-lg)] border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:border-brand-accent";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[var(--radius-xl)] border border-border p-6">
        <span className="grid size-9 place-items-center rounded-full bg-brand-accent-soft text-brand-accent">
          <Check className="size-4" strokeWidth={2.5} />
        </span>
        <p className="text-sm text-foreground">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] size-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-muted-foreground">
            {t("nameLabel")}
          </span>
          <input
            name="name"
            required
            minLength={2}
            placeholder={t("namePlaceholder")}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-muted-foreground">
            {t("emailLabel")}
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-muted-foreground">
          {t("messageLabel")}
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={`${inputClass} resize-y`}
        />
      </label>

      {status === "error" && (
        <p className="text-[13px] text-danger">
          {t("error")}{" "}
          <a href={site.links.email} className="underline underline-offset-2">
            {site.email}
          </a>
        </p>
      )}

      <div className="mt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className={`${buttonClass("primary")} disabled:opacity-60`}
        >
          {status === "sending" ? t("sending") : t("submit")}
          {status !== "sending" && <ArrowRight className="size-4 rtl:rotate-180" />}
        </button>
      </div>
    </form>
  );
}
