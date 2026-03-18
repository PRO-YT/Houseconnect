import { NextResponse } from "next/server";

import { getSubscriptionPlans } from "@/lib/repository";

export async function GET() {
  return NextResponse.json({ items: getSubscriptionPlans() });
}
