import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingForm } from "@/components/forms/booking-form";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { PageShell } from "@/components/layout/page-shell";
import { MapCard } from "@/components/property/map-card";
import { PropertyGallery } from "@/components/property/property-gallery";
import { SimilarProperties } from "@/components/property/similar-properties";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPinIcon, ShieldIcon } from "@/components/ui/icons";
import { getAgentById, getPropertyBySlug, getSimilarProperties } from "@/lib/repository";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property || property.status !== "approved") {
    return buildMetadata({
      title: "Listing not found",
      description: "This listing is not available.",
      path: `/listings/${slug}`,
    });
  }

  return buildMetadata({
    title: property.title,
    description: property.description,
    path: `/listings/${property.slug}`,
  });
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property || property.status !== "approved") {
    notFound();
  }

  const agent = property.assignedAgentId ? getAgentById(property.assignedAgentId) : null;
  const similar = getSimilarProperties(property);
  const totalUpfrontRent =
    property.fees.agencyFee || property.fees.legalFee || property.fees.serviceCharge
      ? Object.values(property.fees).reduce((sum, value) => sum + (value || 0), property.price)
      : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: property.currency,
      price: property.price,
      availability:
        property.availabilityStatus === "available-now"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
    },
  };

  return (
    <section className="section-space">
      <PageShell className="space-y-10">
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/listings">Listings</Link>
          <span>/</span>
          <span className="text-slate-900">{property.title}</span>
        </div>

        <PropertyGallery images={property.images} />

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              {property.featured ? <Badge tone="accent">Featured</Badge> : null}
              {property.reviewedListing ? <Badge tone="success">Reviewed listing</Badge> : null}
              <Badge tone="neutral">{property.reference}</Badge>
            </div>

            <div>
              <p className="text-4xl font-semibold tracking-tight text-slate-950">
                {formatCurrency(property.price, property.currency)}
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                {property.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-base text-slate-600">
                <MapPinIcon className="h-4 w-4" />
                {property.address}, {property.area}, {property.city}, {property.state}
              </p>
            </div>

            <Card className="p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-sm text-slate-500">Bedrooms</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bathrooms</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{property.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Parking</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{property.parkingSpaces}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Size</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{property.size} sqm</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-slate-950">Description</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{property.description}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    key={amenity}
                  >
                    {amenity}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-slate-950">Pricing and fees</h2>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                <p>Rent / price: {formatCurrency(property.price, property.currency)}</p>
                {property.fees.serviceCharge ? (
                  <p>Service charge: {formatCurrency(property.fees.serviceCharge, property.currency)}</p>
                ) : null}
                {property.fees.cautionFee ? (
                  <p>Caution fee: {formatCurrency(property.fees.cautionFee, property.currency)}</p>
                ) : null}
                {property.fees.agencyFee ? (
                  <p>Agency fee: {formatCurrency(property.fees.agencyFee, property.currency)}</p>
                ) : null}
                {property.fees.legalFee ? (
                  <p>Legal fee: {formatCurrency(property.fees.legalFee, property.currency)}</p>
                ) : null}
                {property.fees.commissionFee ? (
                  <p>Commission fee: {formatCurrency(property.fees.commissionFee, property.currency)}</p>
                ) : null}
                {totalUpfrontRent ? (
                  <p className="font-semibold text-slate-950">
                    Estimated total upfront commitment: {formatCurrency(totalUpfrontRent, property.currency)}
                  </p>
                ) : null}
              </div>
            </Card>

            <MapCard
              label={`${property.area}, ${property.city}`}
              latitude={property.latitude}
              longitude={property.longitude}
            />
          </div>

          <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Contact the agent</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Message the assigned agent to confirm availability, fee breakdown, and next steps.
              </p>
              <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                  {agent?.user.fullName.split(" ").map((name) => name[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{agent?.user.fullName}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <ShieldIcon className="h-4 w-4 text-emerald-600" />
                    {agent?.profile?.verificationStatus === "verified"
                      ? "Verified agent"
                      : "Verification pending"}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <InquiryForm propertyId={property.id} />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink
                  href={`https://wa.me/${(agent?.profile?.whatsappNumber || "+2348031000002").replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I am interested in ${property.title}`)}`}
                  variant="secondary"
                >
                  WhatsApp agent
                </ButtonLink>
                <ButtonLink href={`/dashboard/messages`} variant="ghost">
                  View inbox demo
                </ButtonLink>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Book a viewing</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Pick a preferred time and the agent can approve, reschedule, or reject from the dashboard.
              </p>
              <div className="mt-6">
                <BookingForm propertyId={property.id} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Trust and disclosure</h2>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                <p>Availability: {property.availabilityStatus.replace(/-/g, " ")}</p>
                <p>Landlord disclosure: {property.landlordId ? "Submitted by known owner profile" : "Agent-managed listing"}</p>
                <p>Last updated: {formatDate(property.updatedAt)}</p>
                <p>Status: {property.status.replace(/-/g, " ")}</p>
              </div>
            </Card>
          </div>
        </div>

        <SimilarProperties properties={similar} />
      </PageShell>
    </section>
  );
}
