import { ListingEditorForm } from "@/components/forms/listing-editor-form";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusChip } from "@/components/dashboard/status-chip";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { demoProperties } from "@/lib/data/demo";
import { formatCurrency } from "@/lib/utils";

export default async function ListingsManagerPage() {
  const session = await requireRole(["agent", "admin"]);
  const listings =
    session.role === "admin"
      ? demoProperties
      : demoProperties.filter((property) => property.assignedAgentId === session.userId);

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Create listings, keep them in draft or pending review, and monitor moderation state at a glance."
        title={session.role === "admin" ? "Listing moderation" : "Listing manager"}
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          columns={["Listing", "Price", "Status", "Purpose"]}
          rows={listings.map((property) => [
            property.title,
            formatCurrency(property.price, property.currency),
            <StatusChip key={`${property.id}-status`} value={property.status} />,
            property.purpose,
          ])}
          title={session.role === "admin" ? "All listings" : "Your listings"}
        />
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">
            {session.role === "admin" ? "Create sample listing" : "Add or update listing"}
          </h2>
          <div className="mt-5">
            <ListingEditorForm mode="agent" />
          </div>
        </Card>
      </div>
    </div>
  );
}
