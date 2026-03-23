import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { ListingSearchControls } from "@/components/property/listing-search-controls";
import { PropertyGrid } from "@/components/property/property-grid";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { popularLocations } from "@/lib/data/demo";
import { buildMetadata } from "@/lib/seo";
import { searchPropertiesServer } from "@/lib/server-repository";
import type { SearchFilters } from "@/lib/types";
import { formatCompactNumber } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Listings",
  description: "Browse premium sale and rental properties with trust signals, filters, and moderated listing quality.",
  path: "/listings",
});

function parseFilters(searchParams: Record<string, string | string[] | undefined>): SearchFilters {
  const parseNumber = (value: string | string[] | undefined) => {
    const candidate = Array.isArray(value) ? value[0] : value;
    return candidate ? Number(candidate) : undefined;
  };

  const parseString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return {
    q: parseString(searchParams.q),
    purpose: (parseString(searchParams.purpose) as SearchFilters["purpose"]) || "all",
    propertyType:
      (parseString(searchParams.propertyType) as SearchFilters["propertyType"]) || "all",
    minPrice: parseNumber(searchParams.minPrice),
    maxPrice: parseNumber(searchParams.maxPrice),
    bedrooms: parseNumber(searchParams.bedrooms),
    furnishingStatus:
      (parseString(searchParams.furnishingStatus) as SearchFilters["furnishingStatus"]) ||
      "all",
    sort: (parseString(searchParams.sort) as SearchFilters["sort"]) || "featured",
    page: parseNumber(searchParams.page) || 1,
  };
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const results = await searchPropertiesServer(filters);

  return (
    <section className="section-space">
      <PageShell>
        <SectionHeading
          eyebrow="Search and discover"
          title="Browse trusted rental and sale inventory"
          description="Use advanced filters, compare premium cards, and keep your shortlist structured in a cleaner real estate workflow."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Filters
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">Search smarter</p>
                </div>
                <Link className="text-sm font-medium text-teal-700" href="/listings">
                  Reset
                </Link>
              </div>
              <div className="mt-5">
                <ListingSearchControls />
              </div>
              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="text-sm font-semibold text-slate-950">Popular locations</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularLocations.map((location) => (
                    <Link
                      className="pill"
                      href={`/listings?q=${encodeURIComponent(location)}`}
                      key={location}
                    >
                      {location}
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Results</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                    {formatCompactNumber(results.total)} listings found
                  </p>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-600">
                  Search state is preserved in the URL, so you can share filtered results with a
                  client, team member, or landlord.
                </p>
              </div>
            </Card>

            <PropertyGrid properties={results.items} />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.2)]">
              <p className="text-sm text-slate-500">
                Page {results.page} of {results.totalPages}
              </p>
              <div className="flex gap-3">
                {results.page > 1 ? (
                  <Link
                    className="pill"
                    href={`/listings?${new URLSearchParams({
                      ...Object.fromEntries(
                        Object.entries(resolvedSearchParams).map(([key, value]) => [
                          key,
                          Array.isArray(value) ? value[0] : value || "",
                        ]),
                      ),
                      page: String(results.page - 1),
                    }).toString()}`}
                  >
                    Previous
                  </Link>
                ) : null}
                {results.page < results.totalPages ? (
                  <Link
                    className="pill"
                    href={`/listings?${new URLSearchParams({
                      ...Object.fromEntries(
                        Object.entries(resolvedSearchParams).map(([key, value]) => [
                          key,
                          Array.isArray(value) ? value[0] : value || "",
                        ]),
                      ),
                      page: String(results.page + 1),
                    }).toString()}`}
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </section>
  );
}
