import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { getVerificationQueue } from "@/lib/repository";
import { sanitizeText } from "@/lib/sanitize";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  return NextResponse.json({ items: getVerificationQueue() });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as { requestId?: string; decision?: string };
  const requestId = sanitizeText(body.requestId, 80);
  const decision = sanitizeText(body.decision, 40);

  if (!requestId || !["verify", "reject"].includes(decision)) {
    return NextResponse.json({ error: "Valid verification decision required." }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message:
      decision === "verify"
        ? "Verification approved successfully."
        : "Verification rejected successfully.",
    requestId,
  });
}
