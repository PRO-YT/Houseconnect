import { NextRequest, NextResponse } from "next/server";

import { getRequestKey } from "@/lib/api";
import { sendTransactionalEmail } from "@/lib/email";
import { assertRateLimit } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  if (!assertRateLimit(getRequestKey(request, "contact"), { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many contact attempts. Please retry in a minute." }, { status: 429 });
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };

  const name = sanitizeText(body.name, 120);
  const email = sanitizeEmail(body.email);
  const message = sanitizeText(body.message, 1200);

  if (name.length < 2 || !email || message.length < 10) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  await sendTransactionalEmail({
    to: "support@houseconnect.africa",
    template: "message",
    subject: `Contact form: ${name}`,
    variables: {
      email,
      message,
      phone: sanitizeText(body.phone, 40),
    },
  });

  return NextResponse.json({
    success: true,
    message: "Your message has been received. Support can now respond through the email layer.",
  });
}
