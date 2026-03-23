import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { getRequestKey } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { searchPropertiesServer } from "@/lib/server-repository";
import { slugify } from "@/lib/utils";
import { validateListingPayload, ValidationError } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = await searchPropertiesServer({
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

  if (!assertRateLimit(getRequestKey(request, "properties-create"), { limit: 12, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: "Too many listing submissions. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  try {
    const payload = validateListingPayload(await request.json());

    const baseSlug = slugify(payload.title);
    const timestamp = Date.now();
    const slug = `${baseSlug}-${String(timestamp).slice(-6)}`;
    const reference = `HC-${new Date().getFullYear()}-${String(timestamp).slice(-8)}`;
    const status =
      session.role === "landlord"
        ? "PENDING_REVIEW"
        : session.role === "admin"
          ? "APPROVED"
          : "DRAFT";

    if (hasDatabaseUrl()) {
      const listing = await prisma.property.create({
        data: {
          title: payload.title,
          slug,
          description: payload.description,
          purpose: payload.purpose.toUpperCase() as never,
          propertyType: payload.propertyType.toUpperCase().replace(/-/g, "_") as never,
          price: new Prisma.Decimal(payload.price),
          currency: "NGN",
          bedrooms: payload.bedrooms,
          bathrooms: payload.bathrooms,
          toilets: payload.toilets,
          size: payload.size,
          furnishingStatus: payload.furnishingStatus.toUpperCase().replace(/-/g, "_") as never,
          availabilityStatus: payload.availabilityStatus.toUpperCase().replace(/-/g, "_") as never,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          area: payload.area,
          neighborhood: payload.neighborhood || null,
          latitude: payload.latitude,
          longitude: payload.longitude,
          amenities: payload.amenities,
          featured: false,
          reviewedListing: session.role === "admin",
          status: status as never,
          createdByUserId: session.userId,
          assignedAgentId: session.role === "agent" ? session.userId : null,
          landlordId: session.role === "landlord" ? session.userId : null,
          approvedByAdminId: session.role === "admin" ? session.userId : null,
          yearBuilt: new Date().getFullYear(),
          reference,
          serviceCharge:
            payload.serviceCharge !== undefined ? new Prisma.Decimal(payload.serviceCharge) : undefined,
          cautionFee:
            payload.cautionFee !== undefined ? new Prisma.Decimal(payload.cautionFee) : undefined,
          agencyFee:
            payload.agencyFee !== undefined ? new Prisma.Decimal(payload.agencyFee) : undefined,
          legalFee: payload.legalFee !== undefined ? new Prisma.Decimal(payload.legalFee) : undefined,
          commissionFee:
            payload.commissionFee !== undefined
              ? new Prisma.Decimal(payload.commissionFee)
              : undefined,
          isPetFriendly: payload.isPetFriendly,
          parkingSpaces: payload.parkingSpaces,
          availableFrom: new Date(payload.availableFrom),
          images: {
            create: payload.imageUrls.map((url, index) => ({
              url,
              alt: `${payload.title} image ${index + 1}`,
              sortOrder: index,
            })),
          },
        },
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message:
          session.role === "landlord"
            ? "Property submitted and routed for moderation."
            : session.role === "admin"
              ? "Listing published and ready for discovery."
              : "Listing draft saved and ready for review.",
        listing: {
          id: listing.id,
          slug: listing.slug,
          reference: listing.reference,
          status: listing.status.toLowerCase().replace(/_/g, "-"),
          imageCount: listing.images.length,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        session.role === "landlord"
          ? "Property submitted and routed for moderation."
          : "Listing draft saved and ready for review.",
      listing: {
        id: `draft-${timestamp}`,
        slug,
        reference,
        status: session.role === "landlord" ? "pending-review" : "draft",
        imageCount: payload.imageUrls.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ValidationError ? error.message : "Unable to save listing." },
      { status: 400 },
    );
  }
}
