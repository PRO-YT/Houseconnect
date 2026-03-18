import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { trustHighlights } from "@/lib/data/demo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Safety and trust",
  description: "How HouseConnect reduces fraud risk and encourages safer property discovery.",
  path: "/safety",
});

export default function SafetyPage() {
  return (
    <>
      <MarketingHero
        description="Trust and safety is a core product layer, not a support afterthought. We use verification, moderated workflows, and visible status labels to make the marketplace feel safer."
        eyebrow="Safety"
        title="Trust mechanisms designed for real-world property risk."
      />
      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Platform protections</h2>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                {trustHighlights.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Safety tips for users</h2>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                <p>Always confirm documentation before making large payments.</p>
                <p>Use verified agent profiles and reviewed listing labels as starting trust signals, not the final check.</p>
                <p>Prefer inspections arranged through the platform so there is a record of timing and participants.</p>
                <p>Report suspicious fee requests, duplicate listings, or pressure to move off-platform too early.</p>
              </div>
            </Card>
          </div>
        </PageShell>
      </section>
    </>
  );
}
