import { NextRequest, NextResponse } from "next/server";

import { sendTransactionalEmail } from "@/lib/email";
import { sanitizeEmail } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string };
  const email = sanitizeEmail(body.email);

  if (!email) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  await sendTransactionalEmail({
    to: email,
    template: "password-reset",
    subject: "Reset your HouseConnect password",
    variables: {
      resetUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Reset email queued through the email abstraction layer.",
  });
}
