import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/payments";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "agent") {
    return NextResponse.json({ error: "Only agents can subscribe to plans." }, { status: 403 });
  }

  const body = (await request.json()) as { planId?: string; provider?: string };
  const planId = sanitizeText(body.planId, 60);
  const provider = sanitizeText(body.provider, 30) as "paystack" | "flutterwave" | "stripe";

  if (!planId || !provider) {
    return NextResponse.json({ error: "Plan and provider are required." }, { status: 400 });
  }

  const checkout = await createCheckoutSession({
    userId: session.userId,
    planId,
    provider,
    type: "subscription",
  });

  return NextResponse.json({ success: true, checkout });
}
