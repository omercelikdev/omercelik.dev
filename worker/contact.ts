/** The contact form's backend: POST /api/contact. Checks the request,
 *  verifies the Turnstile token, then sends the message to the site owner
 *  through Resend with the visitor's address as Reply-To. */

export interface ContactEnv {
  /** Recipient, e.g. "omer@omercelik.dev" (wrangler.jsonc vars). */
  CONTACT_TO: string;
  /** Sender on a domain verified in Resend (wrangler.jsonc vars). */
  CONTACT_FROM: string;
  /** Secrets — set in Cloudflare, never in the repo. */
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  /** "1" for local runs: log the email instead of sending it, and skip the
   *  hostname check Cloudflare's test keys can't pass. */
  CONTACT_DRY_RUN?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type ContactError =
  "method" | "origin" | "invalid" | "verification" | "unavailable" | "failed";

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
  /** Request body, in bytes — well above the largest valid message. */
  body: 32_000,
} as const;

/** The widget's action name; the server checks the token was issued for it. */
export const TURNSTILE_ACTION = "contact";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND = "https://api.resend.com/emails";

// No spaces, angle brackets, quotes, commas or semicolons: nothing that could
// turn one address into several or break out of a header.
const EMAIL = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[^\s@<>()",;:\\]{2,}$/;

// Control characters (line breaks included) never belong in a name or a
// subject line.
const CONTROL = /[\u0000-\u001f\u007f]+/g;

type Parsed =
  | { ok: true; message: ContactMessage; token: string }
  | { ok: false; reason: "invalid" | "spam" };

/** Validate the JSON body the form sends. `botcheck` is a honeypot: a field
 *  people never see, so anything in it came from a bot. */
export function parseContact(body: unknown): Parsed {
  if (!body || typeof body !== "object")
    return { ok: false, reason: "invalid" };
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");

  if (str(b.botcheck).trim() !== "") return { ok: false, reason: "spam" };

  const name = str(b.name).replace(CONTROL, " ").replace(/\s+/g, " ").trim();
  const email = str(b.email).trim();
  const message = str(b.message).replace(/\r\n?/g, "\n").trim();
  const token = str(b.token);

  const valid =
    name.length >= LIMITS.name.min &&
    name.length <= LIMITS.name.max &&
    email.length <= LIMITS.email.max &&
    EMAIL.test(email) &&
    message.length >= LIMITS.message.min &&
    message.length <= LIMITS.message.max &&
    token !== "";

  return valid
    ? { ok: true, message: { name, email, message }, token }
    : { ok: false, reason: "invalid" };
}

/** The email as Resend's API takes it. Plain text only: nothing the visitor
 *  typed is ever interpreted as HTML. */
export function buildEmail(env: ContactEnv, m: ContactMessage) {
  return {
    from: env.CONTACT_FROM,
    to: [env.CONTACT_TO],
    reply_to: m.email,
    subject: `Message from ${m.name} · omercelik.dev`,
    text: `${m.message}\n\n—\nFrom: ${m.name} <${m.email}>\nSent from the contact form on omercelik.dev. Reply to this email to answer.`,
  };
}

function json(status: number, body: { ok: true } | { error: ContactError }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

const fail = (status: number, error: ContactError) => json(status, { error });

async function verifyTurnstile(
  token: string,
  request: Request,
  env: ContactEnv,
  fetcher: typeof fetch,
): Promise<boolean> {
  const res = await fetcher(SITEVERIFY, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get("cf-connecting-ip") ?? undefined,
    }),
  });
  if (!res.ok) return false;
  const outcome = (await res.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  if (!outcome.success) return false;
  // Test keys report a placeholder hostname and no action; real tokens must
  // have been issued on this site, for this form.
  if (env.CONTACT_DRY_RUN === "1") return true;
  return (
    outcome.hostname === new URL(request.url).hostname &&
    outcome.action === TURNSTILE_ACTION
  );
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST") {
    const res = fail(405, "method");
    res.headers.set("allow", "POST");
    return res;
  }

  // Only the site's own pages post here.
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return fail(403, "origin");
  }

  const raw = await request.text();
  if (raw.length > LIMITS.body) return fail(413, "invalid");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "invalid");
  }

  const parsed = parseContact(body);
  // A bot that filled the honeypot gets the same answer as a person, so it
  // has nothing to learn from — but nothing is sent.
  if (!parsed.ok && parsed.reason === "spam") return json(200, { ok: true });
  if (!parsed.ok) return fail(400, "invalid");

  const dryRun = env.CONTACT_DRY_RUN === "1";
  if (!env.TURNSTILE_SECRET_KEY || (!env.RESEND_API_KEY && !dryRun)) {
    console.error(
      "[contact] TURNSTILE_SECRET_KEY or RESEND_API_KEY is not set",
    );
    return fail(503, "unavailable");
  }

  if (!(await verifyTurnstile(parsed.token, request, env, fetcher))) {
    return fail(403, "verification");
  }

  const email = buildEmail(env, parsed.message);
  if (dryRun) {
    console.log("[contact] dry run — not sent:", JSON.stringify(email));
    return json(200, { ok: true });
  }

  const res = await fetcher(RESEND, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(email),
  });
  if (!res.ok) {
    console.error(`[contact] Resend ${res.status}: ${await res.text()}`);
    return fail(502, "failed");
  }
  return json(200, { ok: true });
}
