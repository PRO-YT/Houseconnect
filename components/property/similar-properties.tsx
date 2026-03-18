import { PropertyGrid } from "@/components/property/property-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Property } from "@/lib/types";

export function SimilarProperties({ properties }: { properties: Property[] }) {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="You may also like"
        title="Similar homes in the same trust tier"
        description="Suggested based on location, purpose, and quality signals."
      />
      <PropertyGrid properties={properties} />
    </section>
  );
}
