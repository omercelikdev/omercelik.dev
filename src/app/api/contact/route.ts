import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/config/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    message?: string;
    company?: string; // honeypot
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (body.company) return NextResponse.json({ ok: true });

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2 || name.length > 100)
    return NextResponse.json({ error: "invalid_name" }, { status: 422 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  if (message.length < 10 || message.length > 5000)
    return NextResponse.json({ error: "invalid_message" }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — tell the client to fall back to a direct email.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.CONTACT_FROM ?? "omercelik.dev <onboarding@resend.dev>";
    const to = process.env.CONTACT_TO ?? site.email;

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New message from ${name} — omercelik.dev`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
