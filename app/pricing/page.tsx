import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { subscriptionPlans } from "@/lib/data/demo";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Compare HouseConnect plans for agents and understand featured placement and verification monetization.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <MarketingHero
        description="Subscription plans are designed to help serious agents scale from a lean starter tier into premium visibility, analytics, and promoted placement."
        eyebrow="Pricing"
        title="Simple plans with room for subscriptions, featured listings, and verification fees."
      />
      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-6 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card
                className={plan.tier === "premium" ? "border-teal-500 bg-slate-950 p-6 text-white" : "p-6"}
                key={plan.id}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{plan.name}</h2>
                    <p className={plan.tier === "premium" ? "mt-2 text-slate-300" : "mt-2 text-slate-500"}>
                      {plan.tier === "free"
                        ? "Best for testing the marketplace"
                        : plan.tier === "pro"
                          ? "For active agents growing inventory"
                          : "For high-performance teams that want premium visibility"}
                    </p>
                  </div>
                  {plan.tier === "premium" ? <Badge tone="accent">Most popular</Badge> : null}
                </div>
                <p className="mt-8 text-4xl font-semibold tracking-tight">
                  {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                  {plan.price > 0 ? <span className="ml-2 text-lg font-medium">/month</span> : null}
                </p>
                <div className="mt-8 grid gap-3 text-sm">
                  <p>{plan.listingLimit} active listings</p>
                  <p>{plan.featuredLimit} featured placements</p>
                  <p>{plan.analyticsEnabled ? "Analytics included" : "Analytics locked"}</p>
                  <p>{plan.prioritySupport ? "Priority support" : "Standard support"}</p>
                  <p>{plan.verificationFeeIncluded ? "Verification fee included" : "Verification billed separately"}</p>
                </div>
                <div className="mt-8">
                  <ButtonLink href="/auth/sign-up" variant={plan.tier === "premium" ? "primary" : "secondary"}>
                    {plan.tier === "free" ? "Start free" : `Choose ${plan.name}`}
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Monetization-ready architecture</h2>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                <p>Featured listing upgrades and sponsored placement slots.</p>
                <p>Agent verification fee workflow with compliance review states.</p>
                <p>Paystack and Flutterwave checkout hooks for recurring billing.</p>
                <p>Lead-credit and pay-per-lead extensions for future rollout.</p>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Frequently asked billing questions</h2>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
                <p>Plans are monthly in the MVP but structured to support annual billing.</p>
                <p>Featured placement can be sold independently of subscription tier.</p>
                <p>Verification fees can be charged only when users enter review.</p>
                <p>Admins can manage plans and future banner placements from the dashboard.</p>
              </div>
            </Card>
          </div>
        </PageShell>
      </section>
    </>
  );
}
