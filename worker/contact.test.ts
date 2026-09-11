import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildEmail,
  handleContact,
  parseContact,
  type ContactEnv,
} from "./contact";

const ORIGIN = "https://omercelik.dev";

const env: ContactEnv = {
  CONTACT_TO: "omer@omercelik.dev",
  CONTACT_FROM: "omercelik.dev <contact@mail.omercelik.dev>",
  RESEND_API_KEY: "re_test",
  TURNSTILE_SECRET_KEY: "turnstile_secret",
};

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello — a question about specdrift.",
  botcheck: "",
  token: "turnstile-token",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: {
      origin: ORIGIN,
      "content-type": "application/json",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Stands in for Turnstile's siteverify and Resend's API. */
function fakeFetch({
  verify = { success: true, hostname: "omercelik.dev", action: "contact" },
  resendStatus = 200,
}: {
  verify?: Record<string, unknown>;
  resendStatus?: number;
} = {}) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fn = async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init: init ?? {} });
    if (url.includes("siteverify")) return Response.json(verify);
    return new Response(
      resendStatus === 200 ? '{"id":"email_1"}' : '{"message":"rejected"}',
      { status: resendStatus },
    );
  };
  return { fetcher: fn as unknown as typeof fetch, calls };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseContact", () => {
  it("accepts a valid message and tidies it", () => {
    const parsed = parseContact({
      ...valid,
      name: "  Ada \r\n Lovelace ",
      message: " Line one\r\nLine two ",
    });
    expect(parsed).toEqual({
      ok: true,
      token: "turnstile-token",
      message: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "Line one\nLine two",
      },
    });
  });

  it.each([
    ["a missing name", { name: "" }],
    ["a one-letter name", { name: "A" }],
    ["an address without a domain", { email: "ada@" }],
    ["two addresses", { email: "ada@example.com, eve@example.com" }],
    ["an address with a header break", { email: "ada@example.com\nBcc: x" }],
    ["a short message", { message: "Hi" }],
    ["a missing token", { token: "" }],
    ["a non-string field", { message: 42 }],
  ])("rejects %s", (_, override) => {
    expect(parseContact({ ...valid, ...override })).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("flags a filled honeypot as spam", () => {
    expect(parseContact({ ...valid, botcheck: "https://spam" })).toEqual({
      ok: false,
      reason: "spam",
    });
  });
});

describe("buildEmail", () => {
  it("goes to the owner, with the visitor as Reply-To", () => {
    const email = buildEmail(env, {
      name: "Ada",
      email: "ada@example.com",
      message: "Hello there, friend.",
    });
    expect(email).toMatchObject({
      from: env.CONTACT_FROM,
      to: ["omer@omercelik.dev"],
      reply_to: "ada@example.com",
      subject: "Message from Ada · omercelik.dev",
    });
    expect(email.text).toContain("Hello there, friend.");
    expect(email.text).toContain("From: Ada <ada@example.com>");
  });
});

describe("handleContact", () => {
  it("sends a verified message through Resend", async () => {
    const { fetcher, calls } = fakeFetch();
    const res = await handleContact(post(valid), env, fetcher);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls.map((c) => c.url)).toEqual([
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      "https://api.resend.com/emails",
    ]);
    const verify = JSON.parse(String(calls[0].init.body));
    expect(verify).toMatchObject({
      secret: "turnstile_secret",
      response: "turnstile-token",
    });
    const resend = calls[1].init;
    expect(new Headers(resend.headers).get("authorization")).toBe(
      "Bearer re_test",
    );
    expect(JSON.parse(String(resend.body))).toMatchObject({
      to: ["omer@omercelik.dev"],
      reply_to: "ada@example.com",
    });
  });

  it("only accepts POST", async () => {
    const res = await handleContact(
      new Request(`${ORIGIN}/api/contact`),
      env,
      fakeFetch().fetcher,
    );
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("POST");
  });

  it("refuses posts from other sites", async () => {
    const { fetcher, calls } = fakeFetch();
    const res = await handleContact(
      post(valid, { origin: "https://evil.example" }),
      env,
      fetcher,
    );
    expect(res.status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it("rejects a body that isn't JSON", async () => {
    const res = await handleContact(post("name=Ada"), env, fakeFetch().fetcher);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "invalid" });
  });

  it("rejects an oversized body", async () => {
    const res = await handleContact(
      post({ ...valid, message: "x".repeat(40_000) }),
      env,
      fakeFetch().fetcher,
    );
    expect(res.status).toBe(413);
  });

  it("rejects invalid fields without calling anything", async () => {
    const { fetcher, calls } = fakeFetch();
    const res = await handleContact(
      post({ ...valid, email: "nope" }),
      env,
      fetcher,
    );
    expect(res.status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it("answers a bot like a person but sends nothing", async () => {
    const { fetcher, calls } = fakeFetch();
    const res = await handleContact(
      post({ ...valid, botcheck: "filled" }),
      env,
      fetcher,
    );
    expect(res.status).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it("fails closed when a secret is missing", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { fetcher, calls } = fakeFetch();
    const res = await handleContact(
      post(valid),
      { ...env, RESEND_API_KEY: undefined },
      fetcher,
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "unavailable" });
    expect(calls).toHaveLength(0);
  });

  it.each([
    ["a failed challenge", { success: false }],
    [
      "a token from another site",
      { success: true, hostname: "evil.example", action: "contact" },
    ],
    [
      "a token for another action",
      { success: true, hostname: "omercelik.dev", action: "login" },
    ],
  ])("refuses %s", async (_, verify) => {
    const { fetcher, calls } = fakeFetch({ verify });
    const res = await handleContact(post(valid), env, fetcher);
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "verification" });
    expect(calls).toHaveLength(1); // never reached Resend
  });

  it("reports a Resend failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { fetcher } = fakeFetch({ resendStatus: 500 });
    const res = await handleContact(post(valid), env, fetcher);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "failed" });
  });

  it("logs instead of sending on a dry run", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    // Cloudflare's test keys: a placeholder hostname and no action.
    const { fetcher, calls } = fakeFetch({
      verify: { success: true, hostname: "example.com" },
    });
    const res = await handleContact(
      post(valid),
      { ...env, RESEND_API_KEY: undefined, CONTACT_DRY_RUN: "1" },
      fetcher,
    );
    expect(res.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(log).toHaveBeenCalledOnce();
  });
});
