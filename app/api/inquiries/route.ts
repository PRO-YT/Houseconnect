import { NextRequest, NextResponse } from "next/server";

import { getRequestKey } from "@/lib/api";
import { sendTransactionalEmail } from "@/lib/email";
import { getPropertyById } from "@/lib/repository";
import { assertRateLimit } from "@/lib/rate-limit";
import { validateInquiryPayload, ValidationError } from "@/lib/validators";

export async function POST(request: NextRequest) {
  if (!assertRateLimit(getRequestKey(request, "inquiry"), { limit: 6, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many inquiries. Please wait before trying again." }, { status: 429 });
  }

  try {
    const payload = validateInquiryPayload(await request.json());
    const property = getPropertyById(payload.propertyId);

    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    await sendTransactionalEmail({
      to: property.assignedAgentId ? "agent@houseconnect.africa" : "support@houseconnect.africa",
      template: "inquiry",
      subject: `New inquiry for ${property.title}`,
      variables: {
        propertyTitle: property.title,
        senderName: payload.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry sent. The assigned agent will also receive an email notification.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ValidationError ? error.message : "Unable to submit inquiry." },
      { status: 400 },
    );
  }
}
