import { ChecklistCard } from "@/components/dashboard/checklist-card";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import { getDashboardMetricsForRole, getPropertiesForOwner } from "@/lib/repository";
import { formatDate } from "@/lib/utils";

export default async function LandlordDashboardPage() {
  const session = await requireRole(["landlord"]);
  const metrics = getDashboardMetricsForRole("landlord", session.userId);
  const properties = getPropertiesForOwner(session.userId);

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/dashboard/submissions"
        ctaLabel="Submit property"
        description="Submit homes or plots, upload supporting proof, track review status, and coordinate with assigned agents."
        title="Landlord dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Property pipeline</h2>
          <div className="mt-5 grid gap-4">
            {properties.map((property) => (
              <div className="rounded-[24px] border border-slate-200 p-4" key={property.id}>
                <p className="font-semibold text-slate-950">{property.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {property.city} · Status: {property.status.replace(/-/g, " ")}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Last updated {formatDate(property.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <ChecklistCard
          items={[
            "Upload proof of ownership before requesting publication.",
            "Assign an agent where moderation requires agent-controlled publishing.",
            "Keep pricing and fees aligned with market reality to reduce report risk.",
            "Track inspection summaries and performance before making price changes.",
          ]}
          title="Submission checklist"
        />
      </div>
    </div>
  );
}
