"use client";

import { type FormEvent } from "react";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/config/site";

const inputClass =
  "w-full rounded-[var(--radius-lg)] border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-faint focus:border-brand-accent";

function mailtoHref(name: string, email: string, message: string) {
  const subject = `Message from ${name}`.trim();
  const body = `${message}\n\n— ${name}${email ? ` <${email}>` : ""}`;
  return `${site.links.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** No backend, no dependency: composing a message opens the visitor's mail
 *  client pre-filled. Swap for a real API route + email service later if wanted. */
export function ContactForm() {
  const t = useTranslations("contact");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Record<string, string>;
    window.location.href = mailtoHref(
      data.name ?? "",
      data.email ?? "",
      data.message ?? "",
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
        <button type="submit" className={buttonClass("primary")}>
          <Mail className="size-4" />
          {t("submit")}
        </button>
      </div>
    </form>
  );
}
