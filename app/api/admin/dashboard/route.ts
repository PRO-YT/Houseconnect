import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { getDashboardMetricsForRole } from "@/lib/repository";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  return NextResponse.json({ items: getDashboardMetricsForRole("admin") });
}
