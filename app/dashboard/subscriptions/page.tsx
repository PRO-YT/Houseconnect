import { SubscribeButton } from "@/components/forms/subscribe-button";
import { MonetizationCard } from "@/components/dashboard/monetization-card";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { subscriptionPlans } from "@/lib/data/demo";
import { getActiveSubscriptionServer } from "@/lib/server-repository";
import { formatCurrency } from "@/lib/utils";

export default async function SubscriptionsDashboardPage() {
  const session = await requireRole(["agent", "admin"]);
  const active = session.role === "agent" ? await getActiveSubscriptionServer(session.userId) : null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Manage plan limits, upgrade eligibility, featured placement strategy, and monetization-ready checkout flows."
        eyebrow="Billing"
        title="Subscriptions and billing"
      />
      {active?.plan ? (
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Current agent plan</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{active.plan.name}</p>
              <p className="mt-2 text-sm text-slate-600">
                Renews against provider reference {active.paymentProviderReference || "pending"}
              </p>
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
              <p>{plan.prioritySupport ? "Priority support included" : "Standard support only"}</p>
            </div>
            {session.role === "agent" && plan.price > 0 ? (
              <div className="mt-6 grid gap-3">
                <SubscribeButton
                  label={`Pay with Paystack`}
                  planId={plan.id}
                  provider="paystack"
                />
                <SubscribeButton
                  label={`Pay with Flutterwave`}
                  planId={plan.id}
                  provider="flutterwave"
                />
              </div>
            ) : (
              <div className="mt-6 rounded-[22px] bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {plan.price === 0
                  ? "Free starter access is already reflected in the product model."
                  : "Admins can review this tier and the monetization logic without initiating checkout."}
              </div>
            )}
          </Card>
        ))}
      </div>
      <MonetizationCard
        badge="Platform strategy"
        description="HouseConnect can earn through layered revenue, which gives you healthier unit economics than relying on a single commission stream."
        items={[
          "Monthly or annual agent subscriptions.",
          "Featured listing boosts sold per slot or per bundle.",
          "Verification fees for high-trust accounts and document review.",
          "Future extension: sponsored inventory, developer packages, and premium reporting.",
        ]}
        title="Revenue channels"
      />
    </div>
  );
}
