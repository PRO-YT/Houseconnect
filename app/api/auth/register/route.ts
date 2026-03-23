import { NextRequest, NextResponse } from "next/server";

import { getRequestKey } from "@/lib/api";
import { registerUserAccount, sessionResponse } from "@/lib/auth";
import { assertRateLimit } from "@/lib/rate-limit";
import { validateRegistrationPayload, ValidationError } from "@/lib/validators";

export async function POST(request: NextRequest) {
  if (!assertRateLimit(getRequestKey(request, "auth-register"), { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many signup attempts. Please wait a minute." }, { status: 429 });
  }

  try {
    const payload = validateRegistrationPayload(await request.json());
    const session = await registerUserAccount(payload);

    return sessionResponse(session, {
      success: true,
      message:
        "Account created. Email verification and identity review are ready for production delivery.",
      role: payload.role,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof ValidationError || error instanceof Error
            ? error.message
            : "Unable to create account.",
      },
      { status: 400 },
    );
  }
}
