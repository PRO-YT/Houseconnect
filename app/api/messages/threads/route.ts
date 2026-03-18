import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { getThreadsForUser } from "@/lib/repository";
import { sanitizeText } from "@/lib/sanitize";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({ items: getThreadsForUser(session.userId) });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json()) as { propertyId?: string; subject?: string };
  const subject = sanitizeText(body.subject, 140);

  return NextResponse.json({
    success: true,
    thread: {
      id: `thread-${Date.now()}`,
      propertyId: body.propertyId || null,
      subject: subject || "New property conversation",
    },
  });
}
