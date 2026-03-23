import { ListingEditorForm } from "@/components/forms/listing-editor-form";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusChip } from "@/components/dashboard/status-chip";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireRole } from "@/lib/auth";
import { getPropertiesForOwnerServer } from "@/lib/server-repository";

export default async function SubmissionDashboardPage() {
  const session = await requireRole(["landlord"]);
  const properties = await getPropertiesForOwnerServer(session.userId);

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Submit new property details, track moderation, and keep documentation aligned with the assigned agent workflow."
        eyebrow="Submission desk"
        title="Property submissions"
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          columns={["Listing", "Area", "Status", "Agent"]}
          rows={properties.map((property) => [
            property.title,
            `${property.area}, ${property.city}`,
            <StatusChip key={`${property.id}-status`} value={property.status} />,
            property.assignedAgentId || "Assignment pending",
          ])}
          title="Your submitted properties"
        />
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)]">
          <h2 className="text-xl font-semibold text-slate-950">Submit property</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add the property pin, sample media, and fee structure now. You can replace the sample images with real property media later.
          </p>
          <div className="mt-5">
            <ListingEditorForm mode="landlord" />
          </div>
        </div>
      </div>
    </div>
  );
}
