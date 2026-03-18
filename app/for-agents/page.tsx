import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "For agents",
  description: "Agent verification, listings, subscriptions, analytics, and promoted placement in one modern dashboard.",
  path: "/for-agents",
});

export default function ForAgentsPage() {
  return (
    <>
      <MarketingHero
        description="Agents are the trust bridge in HouseConnect. Verified profiles, listing controls, lead workflows, and monetization tools help strong operators stand out."
        eyebrow="For agents"
        title="A cleaner way to manage listings, leads, and premium exposure."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/auth/sign-up">Become an agent</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary">
            Compare plans
          </ButtonLink>
        </div>
      </MarketingHero>
      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              ["Verification center", "Submit documents, track status, and unlock higher-trust profile presentation."],
              ["Lead pipeline", "Organize inquiries across new, contacted, inspection, negotiation, closed, and lost."],
              ["Monetization", "Upgrade plans, purchase featured placement, and prepare for pay-per-lead or verification fees."],
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
