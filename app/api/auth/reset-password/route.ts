import { NextRequest, NextResponse } from "next/server";

import { sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { token?: string; password?: string };
  const token = sanitizeText(body.token, 300);
  const password = sanitizeText(body.password, 120);

  if (!token || password.length < 8) {
    return NextResponse.json({ error: "Token and a strong password are required." }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Password reset endpoint validated the request. Persist to the database when Prisma is connected.",
  });
}
