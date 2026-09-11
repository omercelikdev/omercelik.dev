import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import "./globals.css";

/** Global fallback for routes that never resolved to a locale — in the static
 *  export this becomes 404.html. Has its own <html> because no root layout
 *  wraps it (the root layout lives in [locale]). */
export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-dvh bg-surface text-foreground antialiased">
        <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-5 px-6 text-center">
          <span className="mono text-display font-medium text-faint">404</span>
          <div className="flex flex-col gap-2">
            <h1 className="text-h2 font-medium">Page not found</h1>
            <p className="max-w-sm text-ui text-muted-foreground">
              The page you are looking for does not exist or has moved.
            </p>
          </div>
          <Link href="/" className={buttonClass("primary")}>
            Back home
          </Link>
        </main>
      </body>
    </html>
  );
}
