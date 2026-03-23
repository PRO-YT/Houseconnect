import { NextRequest, NextResponse } from "next/server";

import { getRequestKey } from "@/lib/api";
import { authenticateUser, sessionResponse } from "@/lib/auth";
import { assertRateLimit } from "@/lib/rate-limit";
import { validateAuthPayload, ValidationError } from "@/lib/validators";

export async function POST(request: NextRequest) {
  if (!assertRateLimit(getRequestKey(request, "auth-login"), { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many login attempts. Please wait a minute." }, { status: 429 });
  }

  try {
    const payload = validateAuthPayload(await request.json());
    const session = await authenticateUser(payload.email, payload.password);

    if (!session) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    return sessionResponse(session, {
      success: true,
      message: "Signed in successfully.",
      role: session.role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ValidationError ? error.message : "Unable to sign in." },
      { status: 400 },
    );
  }
}
