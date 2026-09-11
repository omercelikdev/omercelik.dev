import { handleContact, type ContactEnv } from "./contact";

type Env = ContactEnv & { ASSETS: Fetcher };

/** The site is static files (./out) served as Worker assets. Only /api/*
 *  reaches this script (run_worker_first in wrangler.jsonc); everything else
 *  is answered by the asset server directly. */
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") return handleContact(request, env);
    if (pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
