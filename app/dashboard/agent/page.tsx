import { VerificationForm } from "@/components/forms/verification-form";
import { ChecklistCard } from "@/components/dashboard/checklist-card";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MessageList } from "@/components/dashboard/message-list";
import { StatusChip } from "@/components/dashboard/status-chip";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import { demoProperties } from "@/lib/data/demo";
import { getActiveSubscription, getDashboardMetricsForRole, getThreadsForUser } from "@/lib/repository";
import { formatCurrency } from "@/lib/utils";

export default async function AgentDashboardPage() {
  const session = await requireRole(["agent"]);
  const metrics = getDashboardMetricsForRole("agent", session.userId);
  const messages = getThreadsForUser(session.userId).map((thread) => ({
    id: thread.id,
    subject: thread.subject,
    counterpart: "Buyer / landlord",
    preview: thread.messages.at(-1)?.body || "No messages yet.",
    createdAt: thread.createdAt,
  }));
  const subscription = getActiveSubscription(session.userId);
  const listings = demoProperties.filter((property) => property.assignedAgentId === session.userId);

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/dashboard/listings"
        ctaLabel="Manage listings"
        description="Track listings, nurture leads, manage bookings, and upgrade your trust and subscription status."
        title="Agent dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">Listing manager</h2>
            <p className="text-sm text-slate-500">
              {subscription?.plan?.name || "Free"} plan · {subscription?.plan?.listingLimit || 2} cap
            </p>
          </div>
          <div className="mt-5 grid gap-4">
            {listings.map((listing) => (
              <div className="rounded-[24px] border border-slate-200 p-4" key={listing.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{listing.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {listing.city} · {formatCurrency(listing.price, listing.currency)}
                    </p>
                  </div>
                  <StatusChip value={listing.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Subscription snapshot</h2>
          <div className="mt-5 rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">Current plan</p>
            <p className="mt-2 text-3xl font-semibold">
              {subscription?.plan?.name || "Free"}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              {subscription?.plan
                ? `${formatCurrency(subscription.plan.price)} / ${subscription.plan.billingInterval}`
                : "Upgrade for analytics, more listings, and featured placement."}
            </p>
          </div>
          <div className="mt-5">
            <VerificationForm />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <MessageList items={messages} />
        <ChecklistCard
          items={[
            "Respond to new inquiries within 15 minutes to lift conversion quality.",
            "Keep fee breakdowns visible for premium rental listings.",
            "Upload sharp media and documentation before requesting review.",
            "Use featured placement on best-performing, high-trust properties.",
          ]}
          title="Growth checklist"
        />
      </div>
    </div>
  );
}
