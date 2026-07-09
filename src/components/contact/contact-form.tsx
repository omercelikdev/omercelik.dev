"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/config/site";

type Status = "idle" | "sending" | "success" | "fallback";

const inputClass =
  "w-full rounded-[var(--radius-lg)] border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:border-brand-accent";

function mailtoHref(name: string, email: string, message: string) {
  const subject = `Message from ${name}`;
  const body = `${message}\n\n— ${name} <${email}>`;
  return `${site.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState<string>(site.links.email);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setMailto(mailtoHref(data.name ?? "", data.email ?? "", data.message ?? ""));

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
        // Email service not configured yet, or a transient failure — offer a
        // pre-filled mail-client fallback so a message can always be sent.
        setStatus("fallback");
      }
    } catch {
      setStatus("fallback");
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

  if (status === "fallback") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] border border-border p-6">
        <p className="text-sm text-muted-foreground">{t("error")}</p>
        <a href={mailto} className={buttonClass("primary")}>
          <Mail className="size-4" />
          {site.email}
        </a>
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
