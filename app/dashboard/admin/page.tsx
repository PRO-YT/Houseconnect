import { DataTable } from "@/components/dashboard/data-table";
import { StatusChip } from "@/components/dashboard/status-chip";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import { demoProperties } from "@/lib/data/demo";
import { getDashboardMetricsForRole, getReportsQueue, getVerificationQueue } from "@/lib/repository";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  const metrics = getDashboardMetricsForRole("admin");
  const verificationQueue = getVerificationQueue();
  const reports = getReportsQueue();

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/dashboard/listings"
        ctaLabel="Open moderation"
        description="Review marketplace health, approve or reject listings, verify agents, handle reports, and monitor monetization readiness."
        title="Admin dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
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
          {demoProperties
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
