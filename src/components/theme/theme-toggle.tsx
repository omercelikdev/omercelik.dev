"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  // `resolvedTheme` is only known on the client, so the first client render
  // must match the server's. `false` on the server, `true` once hydrated —
  // the sanctioned way to express that without setState inside an effect.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const isDark = hydrated && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("toggle")}
      title={t("toggle")}
      className="grid size-9 place-items-center rounded-[var(--radius-lg)] border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {isDark ? (
        <Moon className="size-4" strokeWidth={2} />
      ) : (
        <Sun className="size-4" strokeWidth={2} />
      )}
    </button>
  );
}
