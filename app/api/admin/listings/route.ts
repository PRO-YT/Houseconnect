import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { demoProperties } from "@/lib/data/demo";
import { sanitizeText } from "@/lib/sanitize";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  return NextResponse.json({ items: demoProperties });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as { listingId?: string; action?: string };
  const listingId = sanitizeText(body.listingId, 80);
  const action = sanitizeText(body.action, 40);

  if (!listingId || !["approve", "reject", "archive"].includes(action)) {
    return NextResponse.json({ error: "Valid listing moderation action required." }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message:
      action === "approve"
        ? "Listing approved successfully."
        : action === "reject"
          ? "Listing rejected successfully."
          : "Listing archived successfully.",
    listingId,
  });
}
