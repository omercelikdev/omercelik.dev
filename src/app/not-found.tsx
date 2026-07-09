import "./globals.css";

/** Global fallback for routes that never resolved to a locale. Has its own
 *  <html> because no root layout wraps it (the root layout lives in [locale]). */
export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-dvh bg-surface text-foreground antialiased">
        <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-5 px-6 text-center">
          <span className="mono text-5xl font-extrabold text-faint">404</span>
          <h1 className="text-xl font-semibold tracking-tight">Page not found</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            The page you are looking for does not exist or has moved.
          </p>
          <a
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-[var(--radius-lg)] bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Back home
          </a>
        </main>
      </body>
    </html>
  );
}
