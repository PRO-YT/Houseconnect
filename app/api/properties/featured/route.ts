import { NextResponse } from "next/server";

import { getFeaturedProperties } from "@/lib/repository";

export async function GET() {
  return NextResponse.json({ items: getFeaturedProperties() });
}
