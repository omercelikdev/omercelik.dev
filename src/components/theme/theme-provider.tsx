"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/** No-flash theme handling via next-themes. Sets data-theme on <html> before
 *  paint (no React <script> warning). Light is the default; system is off. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
