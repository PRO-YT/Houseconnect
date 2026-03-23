import { NextResponse } from "next/server";

import { getPropertyBySlugServer } from "@/lib/server-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const property = await getPropertyBySlugServer(slug);

  if (!property) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({ item: property });
}
