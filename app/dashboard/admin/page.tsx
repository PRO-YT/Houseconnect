import { DataTable } from "@/components/dashboard/data-table";
import { MonetizationCard } from "@/components/dashboard/monetization-card";
import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { StatusChip } from "@/components/dashboard/status-chip";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import {
  getListingManagerPropertiesServer,
  getReportsQueueServer,
  getSessionUserServer,
  getVerificationQueueServer,
} from "@/lib/server-repository";

export default async function AdminDashboardPage() {
  const session = await requireRole(["admin"]);
  const [{ user, profile }, verificationQueue, reports, listings] = await Promise.all([
    getSessionUserServer(session),
    getVerificationQueueServer(),
    getReportsQueueServer(),
    getListingManagerPropertiesServer(session.userId, session.role),
  ]);

  const metrics = [
    { label: "Total listings", value: String(listings.length), trend: "Moderation scope across the marketplace" },
    {
      label: "Pending approvals",
      value: String(listings.filter((property) => property.status === "pending-review").length),
      trend: "Requires publishing decisions",
    },
    {
      label: "Verification queue",
      value: String(verificationQueue.length),
      trend: "Compliance and trust operations",
    },
    { label: "Open reports", value: String(reports.length), trend: "Fraud and duplication review" },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/dashboard/listings"
        ctaLabel="Open moderation"
        description="Review marketplace health, approve or reject listings, verify agents, handle reports, and monitor monetization readiness."
        eyebrow="Admin workspace"
        title="Admin dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ProfileSummaryCard profile={profile} role={session.role} user={user} />
        <MonetizationCard
          badge="Platform revenue"
          ctaHref="/dashboard/subscriptions"
          ctaLabel="Open monetization"
          description="The platform is now positioned to earn from several complementary revenue streams, which is healthier than relying on a single pricing lever."
          items={[
            "Agent subscriptions for listing capacity and analytics.",
            "Featured listing upgrades sold separately from plan tiers.",
            "Verification fees for premium trust workflows.",
            "Future extension: sponsored developer inventory and banner placements.",
          ]}
          title="Revenue overview"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DataTable
          columns={["User", "Type", "Status", "Note"]}
          rows={verificationQueue.map((item) => [
            <div key={`${item.id}-user`}>
              <p className="font-semibold text-slate-950">{item.user?.fullName}</p>
              <p className="text-xs text-slate-500">{item.profile?.companyName || item.user?.email}</p>
            </div>,
            item.type,
            <StatusChip key={`${item.id}-status`} value={item.status} />,
            item.adminNote,
          ])}
          title="Verification queue"
        />
        <DataTable
          columns={["Listing", "Reason", "Status", "Reporter"]}
          rows={reports.map((item) => [
            <div key={`${item.id}-property`}>
              <p className="font-semibold text-slate-950">{item.property?.title || "General report"}</p>
              <p className="text-xs text-slate-500">{item.property?.reference}</p>
            </div>,
            item.reason,
            <StatusChip key={`${item.id}-status`} value={item.status} />,
            item.reporter?.fullName || "Anonymous",
          ])}
          title="Report queue"
        />
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-950">Pending approvals</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {listings
            .filter((property) => property.status === "pending-review")
            .map((property) => (
              <div className="rounded-[24px] border border-slate-200 p-4" key={property.id}>
                <p className="font-semibold text-slate-950">{property.title}</p>
                <p className="mt-1 text-sm text-slate-500">{property.city}</p>
                <div className="mt-3">
                  <StatusChip value={property.status} />
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
