import { NextRequest, NextResponse } from "next/server";

import { getRequestKey } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/email";
import { getBookingsForUser, getPropertyById } from "@/lib/repository";
import { assertRateLimit } from "@/lib/rate-limit";
import { validateBookingPayload, ValidationError } from "@/lib/validators";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({
    items: getBookingsForUser(session.userId, session.role === "agent" ? "agent" : "buyer"),
  });
}

export async function POST(request: NextRequest) {
  if (!assertRateLimit(getRequestKey(request, "booking"), { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many booking attempts. Try again shortly." }, { status: 429 });
  }

  try {
    const payload = validateBookingPayload(await request.json());
    const property = getPropertyById(payload.propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    await sendTransactionalEmail({
      to: "agent@houseconnect.africa",
      template: "booking",
      subject: `Viewing request for ${property.title}`,
      variables: {
        propertyTitle: property.title,
        preferredDate: payload.preferredDate,
        preferredTime: payload.preferredTime,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Viewing request sent. The agent can now approve, reschedule, or reject it.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ValidationError ? error.message : "Unable to request viewing." },
      { status: 400 },
    );
  }
}
