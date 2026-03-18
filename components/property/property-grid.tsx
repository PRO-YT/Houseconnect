import { EmptyState } from "@/components/ui/empty-state";
import { PropertyCard } from "@/components/property/property-card";
import type { Property } from "@/lib/types";

export function PropertyGrid({
  properties,
}: {
  properties: Property[];
}) {
  if (!properties.length) {
    return (
      <EmptyState
        title="No listings match these filters"
        description="Try broadening the price range, removing an amenity, or switching between rent and sale."
        ctaHref="/listings"
        ctaLabel="Reset search"
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
