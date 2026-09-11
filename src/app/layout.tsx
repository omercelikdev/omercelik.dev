import type { ReactNode } from "react";

/** The real root layout — the one with <html> — is app/[locale]/layout.tsx.
 *  This pass-through exists only because app/page.tsx and app/not-found.tsx
 *  live outside the locale segment; each renders its own document. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
