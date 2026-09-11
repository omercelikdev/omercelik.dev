"use client";

import { type FormEvent } from "react";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/config/site";

const inputClass =
  "w-full rounded-[var(--radius-lg)] border border-input bg-background px-3.5 py-2.5 text-body text-foreground outline-none transition-colors placeholder:text-faint focus:border-brand-accent";

/** No backend, no dependency, and honest about it: submitting opens the
 *  visitor's own mail app with the message filled in. The reply address is
 *  whatever account they send from, so the form doesn't ask for it. */
export function ContactForm() {
  const t = useTranslations("contact");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(t("subject", { name }));
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.assign(`${site.links.email}?subject=${subject}&body=${body}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-caption font-medium text-muted-foreground">
          {t("nameLabel")}
        </span>
        <input
          name="name"
          required
          minLength={2}
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-caption font-medium text-muted-foreground">
          {t("messageLabel")}
        </span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder={t("messagePlaceholder")}
          className={`${inputClass} resize-y`}
        />
      </label>

      <div className="mt-1 flex flex-col items-start gap-2.5">
        <button type="submit" className={buttonClass("primary")}>
          <Mail className="size-4" />
          {t("submit")}
        </button>
        <p className="text-caption text-muted-foreground">{t("note")}</p>
      </div>
    </form>
  );
}
