import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CompareToggle } from "@/components/property/compare-toggle";
import { FavoriteToggle } from "@/components/property/favorite-toggle";
import { MapPinIcon, ShieldIcon } from "@/components/ui/icons";
import type { Property } from "@/lib/types";
import { capitalize, formatCurrency } from "@/lib/utils";
import { getAgentById } from "@/lib/repository";

export function PropertyCard({ property }: { property: Property }) {
  const agent = property.assignedAgentId ? getAgentById(property.assignedAgentId) : null;
  const leadImage = property.images[0];

  return (
    <Link href={`/listings/${property.slug}`}>
      <Card className="overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-[0_40px_120px_-70px_rgba(15,23,42,0.45)]">
        <div className="relative h-60 overflow-hidden">
          <Image
            alt={leadImage.alt}
            className="h-full w-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            src={leadImage.url}
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {property.featured ? <Badge tone="accent">Featured</Badge> : null}
            {property.reviewedListing ? <Badge tone="success">Reviewed listing</Badge> : null}
          </div>
          <div className="absolute right-4 top-4 flex flex-wrap gap-2">
            <FavoriteToggle propertyId={property.id} />
            <CompareToggle propertyId={property.id} />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                {formatCurrency(property.price, property.currency)}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{property.title}</h3>
            </div>
            <Badge tone={property.purpose === "rent" ? "accent" : "neutral"}>
              {property.purpose === "rent" ? "For rent" : "For sale"}
            </Badge>
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <MapPinIcon className="h-4 w-4" />
            {property.area}, {property.city}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
            <span>{property.bedrooms} beds</span>
            <span>{property.bathrooms} baths</span>
            <span>{property.parkingSpaces} parking</span>
            <span>{capitalize(property.propertyType)}</span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
            <div>
              <p className="font-medium text-slate-900">{agent?.user.fullName ?? "Assigned agent"}</p>
              <p className="mt-1 flex items-center gap-2 text-slate-500">
                <ShieldIcon className="h-4 w-4 text-emerald-600" />
                {agent?.profile?.verificationStatus === "verified"
                  ? "Verified agent"
                  : "Verification pending"}
              </p>
            </div>
            <span className="text-slate-400">{property.reference}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
