import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "For landlords",
  description: "Submit properties, upload documents, request agent support, and track moderation without bypassing marketplace rules.",
  path: "/for-landlords",
});

export default function ForLandlordsPage() {
  return (
    <>
      <MarketingHero
        description="Landlords can submit stock confidently while HouseConnect keeps publication rules intact. The result is cleaner inventory, better documentation, and fewer risky off-platform detours."
        eyebrow="For landlords"
        title="Submit properties with structure, visibility, and moderated trust."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/auth/sign-up">Create landlord account</ButtonLink>
          <ButtonLink href="/safety" variant="secondary">
            Review trust standards
          </ButtonLink>
        </div>
      </MarketingHero>
      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              ["Property submissions", "Add property details, upload proof, and send it to agents or admin for moderation."],
              ["Agent coordination", "Request assignment and monitor what the assigned agent has changed or published."],
              ["Performance summary", "See approval status, inquiry volume, and activity signals for each property."],
            ].map(([title, text]) => (
              <Card className="p-6" key={title}>
                <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>
    </>
  );
}
