import { NextRequest, NextResponse } from "next/server";

import { getRequestKey } from "@/lib/api";
import { sessionResponse } from "@/lib/auth";
import { assertRateLimit } from "@/lib/rate-limit";
import { sanitizeEmail } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import { validateRegistrationPayload, ValidationError } from "@/lib/validators";

export async function POST(request: NextRequest) {
  if (!assertRateLimit(getRequestKey(request, "auth-register"), { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many signup attempts. Please wait a minute." }, { status: 429 });
  }

  try {
    const payload = validateRegistrationPayload(await request.json());
    const session = {
      userId: `self-serve-${slugify(payload.fullName)}-${Date.now()}`,
      role: payload.role,
      email: sanitizeEmail(payload.email),
      fullName: payload.fullName,
      issuedAt: Date.now(),
    } as const;

    return sessionResponse(session, {
      success: true,
      message: "Account created. Email verification is scaffolded for production delivery.",
      role: payload.role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ValidationError ? error.message : "Unable to create account." },
      { status: 400 },
    );
  }
}
