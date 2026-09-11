"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/config/site";

const inputClass =
  "w-full rounded-[var(--radius-lg)] border border-input bg-background px-3.5 py-2.5 text-field text-foreground outline-none transition-colors placeholder:text-faint focus:border-brand-accent";

/** The public Turnstile site key. NEXT_PUBLIC_TURNSTILE_SITE_KEY overrides it
 *  for local runs with Cloudflare's test key (.env.example). */
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || site.contact.turnstileSiteKey;

/** The contact form posts to the site's Worker (worker/contact.ts), which
 *  checks the Turnstile token and emails the message. Until a site key is
 *  configured it's a plain email link — never a form that can't send. */
export function ContactForm() {
  return SITE_KEY ? <SendingForm siteKey={SITE_KEY} /> : <DirectEmail />;
}

function DirectEmail() {
  const t = useTranslations("contact");
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="text-body text-muted-foreground">{t("direct")}</p>
      <a href={site.links.email} className={buttonClass("primary")}>
        <Mail className="size-4" />
        {site.email}
      </a>
    </div>
  );
}

type Turnstile = {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileLoader: Promise<Turnstile> | null = null;

/** Load Cloudflare's widget script once, on the contact page only. */
function loadTurnstile(): Promise<Turnstile> {
  turnstileLoader ??= new Promise<Turnstile>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("Turnstile did not load"));
    script.onerror = () => {
      turnstileLoader = null; // let a later visit try again
      reject(new Error("Turnstile did not load"));
    };
    document.head.appendChild(script);
  });
  return turnstileLoader;
}

type ErrorCode = "invalid" | "verification" | "failed";
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; name: string }
  | { kind: "error"; code: ErrorCode };

const ERROR_KEY = {
  invalid: "errorInvalid",
  verification: "errorVerification",
} as const;

function SendingForm({ siteKey }: { siteKey: string }) {
  const t = useTranslations("contact");
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !widgetEl.current) return;
        widgetId.current = turnstile.render(widgetEl.current, {
          sitekey: siteKey,
          action: "contact",
          // Invisible unless Cloudflare wants the visitor to click a box.
          appearance: "interaction-only",
          size: "flexible",
          theme:
            document.documentElement.dataset.theme === "dark"
              ? "dark"
              : "light",
          language: "en",
          callback: (value: string) => setToken(value),
          "expired-callback": () => setToken(null),
          "error-callback": () => setToken(null),
        });
      })
      .catch(() => setStatus({ kind: "error", code: "verification" }));

    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    setStatus({ kind: "sending" });

    let next: Status;
    try {
      const res = await fetch(site.contact.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email: data.get("email"),
          message: data.get("message"),
          botcheck: data.get("botcheck"),
          token,
        }),
      });
      if (res.ok) {
        form.reset();
        next = { kind: "sent", name };
      } else {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        next = {
          kind: "error",
          code:
            body.error === "invalid" || body.error === "verification"
              ? body.error
              : "failed",
        };
      }
    } catch {
      next = { kind: "error", code: "failed" };
    }

    // A token passes one check only: get a fresh one for the next message.
    setToken(null);
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
    setStatus(next);
  }

  const sending = status.kind === "sending";

  return (
    <>
      {status.kind === "sent" && (
        <div
          role="status"
          className="flex flex-col items-start gap-3 rounded-[var(--radius-xl)] border border-border p-6"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-success-border bg-success-bg text-success">
            <Check className="size-4" aria-hidden />
          </span>
          <h2 className="text-h3 font-medium">{t("sentTitle")}</h2>
          <p className="text-ui text-muted-foreground">
            {t("sentBody", { name: status.name })}
          </p>
          <button
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
            className={`${buttonClass("outline", "sm")} mt-1`}
          >
            {t("sendAnother")}
          </button>
        </div>
      )}

      {/* Hidden rather than unmounted once sent, so the Turnstile widget
          stays in place for the next message. */}
      <form
        onSubmit={onSubmit}
        hidden={status.kind === "sent"}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-muted-foreground">
            {t("nameLabel")}
          </span>
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-caption font-medium text-muted-foreground">
            {t("emailLabel")}
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
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
            maxLength={5000}
            rows={6}
            placeholder={t("messagePlaceholder")}
            className={`${inputClass} resize-y`}
          />
        </label>

        {/* Honeypot: off-screen and out of the tab order, so only bots fill
            it in. The Worker quietly drops anything that arrives with it. */}
        <div
          aria-hidden
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label>
            Leave this empty
            <input name="botcheck" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div ref={widgetEl} />

        <div className="mt-1 flex flex-col items-start gap-2.5">
          <button
            type="submit"
            disabled={sending || !token}
            className={`${buttonClass("primary")} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <Send className="size-4" />
            {sending ? t("sending") : t("submit")}
          </button>

          <div aria-live="polite">
            {status.kind === "error" && (
              <p role="alert" className="text-caption text-danger">
                {status.code === "failed"
                  ? t.rich("errorFailed", {
                      address: site.email,
                      link: (chunks) => (
                        <a
                          href={site.links.email}
                          className="font-medium underline underline-offset-4"
                        >
                          {chunks}
                        </a>
                      ),
                    })
                  : t(ERROR_KEY[status.code])}
              </p>
            )}
          </div>

          <p className="text-caption text-muted-foreground">{t("note")}</p>
        </div>
      </form>
    </>
  );
}
