import { ChecklistCard } from "@/components/dashboard/checklist-card";
import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import {
  getPropertiesForOwnerServer,
  getSessionUserServer,
  getThreadsForUserServer,
} from "@/lib/server-repository";
import { formatDate } from "@/lib/utils";

export default async function LandlordDashboardPage() {
  const session = await requireRole(["landlord"]);
  const [{ user, profile }, properties, threads] = await Promise.all([
    getSessionUserServer(session),
    getPropertiesForOwnerServer(session.userId),
    getThreadsForUserServer(session.userId),
  ]);

  const metrics = [
    { label: "Submitted properties", value: String(properties.length), trend: "Across active owner submissions" },
    {
      label: "Pending review",
      value: String(properties.filter((property) => property.status === "pending-review").length),
      trend: "Awaiting moderation or agent action",
    },
    {
      label: "Approved stock",
      value: String(properties.filter((property) => property.status === "approved").length),
      trend: "Live and ready for inquiries",
    },
    {
      label: "Coordination threads",
      value: String(threads.length),
      trend: "Agent and moderation follow-up in one place",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/dashboard/submissions"
        ctaLabel="Submit property"
        description="Submit homes or plots, upload supporting proof, track review status, and coordinate with assigned agents."
        eyebrow="Landlord workspace"
        title="Landlord dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <ProfileSummaryCard
          ctaHref="/dashboard/profile"
          ctaLabel="Review profile"
          profile={profile}
          role={session.role}
          user={user}
        />
        <ChecklistCard
          items={[
            "Upload proof of ownership before requesting publication.",
            "Keep map pins accurate so seekers understand the neighborhood context.",
            "Use clear fee disclosure to reduce negotiation friction and report risk.",
            "Coordinate with agents in-platform so every promise stays documented.",
          ]}
          title="Owner trust checklist"
        />
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
                <p className="mt-2 text-sm text-slate-500">Last updated {formatDate(property.updatedAt)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Landlord operating notes</h2>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-slate-600">
            <p>Every new submission now supports map coordinates, media placeholders, and fee breakdowns from the start.</p>
            <p>The moderation flow is designed so ownership proof and clean listing details can be reviewed before publication.</p>
            <p>As the product evolves, landlord profiles can become premium trust surfaces for large portfolios and managed estates.</p>
          </div>
          <div className="mt-6 rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">Visibility principle</p>
            <p className="mt-2 text-2xl font-semibold">Trust before reach</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Clean documentation, accurate media, and reliable location pins improve conversion more than rushed publication.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
