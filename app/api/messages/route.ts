import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { getRequestKey } from "@/lib/api";
import { assertRateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!assertRateLimit(getRequestKey(request, "message-send"), { limit: 15, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Messaging rate limit reached." }, { status: 429 });
  }

  const body = (await request.json()) as { threadId?: string; body?: string };
  const message = sanitizeText(body.body, 1500);

  if (!body.threadId || message.length < 1) {
    return NextResponse.json({ error: "Thread and message body are required." }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: {
      id: `msg-${Date.now()}`,
      threadId: body.threadId,
      senderId: session.userId,
      body: message,
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  });
}
