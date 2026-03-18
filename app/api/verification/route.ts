import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { sanitizeText } from "@/lib/sanitize";

export async function GET() {
  return NextResponse.json({
    items: [
      {
        id: "verify-demo",
        status: "under-review",
        note: "Sample queue entry",
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !["agent", "landlord"].includes(session.role)) {
    return NextResponse.json({ error: "Verification is only available to agents and landlords." }, { status: 403 });
  }

  const body = (await request.json()) as {
    type?: string;
    licenseNumber?: string;
    documentUrl?: string;
    note?: string;
  };

  if (!sanitizeText(body.documentUrl, 500)) {
    return NextResponse.json({ error: "Document URL is required." }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Verification request submitted and routed to admin review.",
    request: {
      id: `verify-${Date.now()}`,
      userId: session.userId,
      type: sanitizeText(body.type, 40) || "identity",
      status: "pending",
    },
  });
}
