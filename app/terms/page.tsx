import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of service",
  description: "Summary MVP terms for acceptable use, moderation, and platform conduct.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <MarketingHero
        description="These MVP terms summarize acceptable use, moderation, and marketplace conduct at a product level."
        eyebrow="Terms"
        title="Clear marketplace rules for users, agents, landlords, and admins."
      />
      <section className="section-space pt-0">
        <PageShell>
          <Card className="p-6">
            <div className="grid gap-4 text-sm leading-7 text-slate-600">
              <p>Users must provide accurate information and may not impersonate agents, landlords, or property owners.</p>
              <p>Listings can be moderated, rejected, archived, or removed if they appear fraudulent, incomplete, or misleading.</p>
              <p>Subscriptions, promoted placement, and verification fees are subject to platform billing rules and future provider terms.</p>
              <p>HouseConnect facilitates introductions and workflows but users remain responsible for their final due diligence.</p>
            </div>
          </Card>
        </PageShell>
      </section>
    </>
  );
}
