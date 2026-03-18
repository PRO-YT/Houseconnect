import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { subscriptionPlans } from "@/lib/data/demo";
import { getActiveSubscription } from "@/lib/repository";
import { formatCurrency } from "@/lib/utils";

export default async function SubscriptionsDashboardPage() {
  const session = await requireRole(["agent", "admin"]);
  const active = session.role === "agent" ? getActiveSubscription(session.userId) : null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Manage plan limits, upgrade eligibility, featured placement strategy, and monetization-ready checkout hooks."
        title="Subscriptions and billing"
      />
      {active?.plan ? (
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Current agent plan</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{active.plan.name}</p>
            </div>
            <Badge tone="success">Active</Badge>
          </div>
        </Card>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card className="p-6" key={plan.id}>
            <h2 className="text-2xl font-semibold text-slate-950">{plan.name}</h2>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
            </p>
            <div className="mt-5 grid gap-2 text-sm text-slate-600">
              <p>{plan.listingLimit} listings</p>
              <p>{plan.featuredLimit} featured placements</p>
              <p>{plan.analyticsEnabled ? "Analytics included" : "Analytics unavailable"}</p>
            </div>
            <div className="mt-6">
              <ButtonLink href="/pricing" variant="secondary">
                Review plan
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
