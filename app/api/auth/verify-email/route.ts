import { NextRequest, NextResponse } from "next/server";

import { sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token?: string };
  const token = sanitizeText(body.token, 300);

  if (!token) {
    return NextResponse.json({ error: "Verification token is required." }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Email verification endpoint is ready for provider and database wiring.",
  });
}
