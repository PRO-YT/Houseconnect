import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { searchProperties } from "@/lib/repository";
import { slugify } from "@/lib/utils";
import { validateListingPayload, ValidationError } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = searchProperties({
    q: searchParams.get("q") || undefined,
    purpose: (searchParams.get("purpose") as "rent" | "sale" | "all" | null) || "all",
    propertyType:
      (searchParams.get("propertyType") as
        | "apartment"
        | "duplex"
        | "studio"
        | "short-let"
        | "land"
        | "commercial"
        | "terrace"
        | "all"
        | null) || "all",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    furnishingStatus:
      (searchParams.get("furnishingStatus") as
        | "furnished"
        | "semi-furnished"
        | "unfurnished"
        | "all"
        | null) || "all",
    sort:
      (searchParams.get("sort") as
        | "relevant"
        | "newest"
        | "price-asc"
        | "price-desc"
        | "featured"
        | null) || "featured",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !["agent", "landlord", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized listing action." }, { status: 403 });
  }

  try {
    const payload = validateListingPayload(await request.json());
    return NextResponse.json({
      success: true,
      message:
        session.role === "landlord"
          ? "Property submitted and routed for moderation."
          : "Listing draft saved and ready for review.",
      listing: {
        id: `draft-${Date.now()}`,
        slug: slugify(payload.title),
        status: session.role === "landlord" ? "pending-review" : "draft",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ValidationError ? error.message : "Unable to save listing." },
      { status: 400 },
    );
  }
}
