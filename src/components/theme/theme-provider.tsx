"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** No-flash theme handling via next-themes. Sets data-theme on <html> before
 *  paint (no React <script> warning). Follows the operating system until the
 *  visitor picks light or dark with the toggle, which is then remembered. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
