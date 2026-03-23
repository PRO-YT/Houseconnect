import { ChecklistCard } from "@/components/dashboard/checklist-card";
import { MonetizationCard } from "@/components/dashboard/monetization-card";
import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { VerificationForm } from "@/components/forms/verification-form";
import { MessageList } from "@/components/dashboard/message-list";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StatusChip } from "@/components/dashboard/status-chip";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import {
  getActiveSubscriptionServer,
  getListingManagerPropertiesServer,
  getSessionUserServer,
  getThreadsForUserServer,
} from "@/lib/server-repository";
import { formatCurrency } from "@/lib/utils";

export default async function AgentDashboardPage() {
  const session = await requireRole(["agent"]);
  const [{ user, profile }, threads, subscription, listings] = await Promise.all([
    getSessionUserServer(session),
    getThreadsForUserServer(session.userId),
    getActiveSubscriptionServer(session.userId),
    getListingManagerPropertiesServer(session.userId, session.role),
  ]);

  const messages = threads.map((thread) => ({
    id: thread.id,
    subject: thread.subject,
    counterpart: "Buyer / landlord",
    preview: thread.messages.at(-1)?.body || "No messages yet.",
    createdAt: thread.createdAt,
  }));

  const metrics = [
    { label: "Managed listings", value: String(listings.length), trend: "Draft, live, and pending review" },
    {
      label: "Featured stock",
      value: String(listings.filter((property) => property.featured).length),
      trend: "High-visibility inventory for premium leads",
    },
    {
      label: "Open conversations",
      value: String(messages.length),
      trend: messages[0] ? "Lead activity is flowing into your inbox" : "No active conversations yet",
    },
    {
      label: "Plan allowance",
      value: String(subscription?.plan?.listingLimit || 2),
      trend: subscription?.plan?.name ? `${subscription.plan.name} plan capacity` : "Free plan limit",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/dashboard/listings"
        ctaLabel="Manage listings"
        description="Track listings, nurture leads, manage bookings, and upgrade your trust and subscription status."
        eyebrow="Agent workspace"
        title="Agent dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ProfileSummaryCard
          ctaHref="/dashboard/profile"
          ctaLabel="Open profile"
          profile={profile}
          role={session.role}
          user={user}
        />
        <MonetizationCard
          badge="Revenue"
          ctaHref="/dashboard/subscriptions"
          ctaLabel="Open billing"
          description="This workspace now reflects the main monetization lanes available to the platform and your team."
          items={[
            "Recurring subscriptions for listing capacity and analytics access.",
            "Featured placement credits for visibility boosts on premium listings.",
            "Verification fees for trust-sensitive account reviews.",
            "Future extension: premium landlord-to-agent lead routing.",
          ]}
          title="Agent monetization stack"
        />
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
            <p className="mt-2 text-3xl font-semibold">{subscription?.plan?.name || "Free"}</p>
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
            "Upload sharp media, map pins, and documentation before requesting review.",
            "Use featured placement on best-performing, high-trust properties.",
          ]}
          title="Growth checklist"
        />
      </div>
    </div>
  );
}
