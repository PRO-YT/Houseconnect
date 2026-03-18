import { DataTable } from "@/components/dashboard/data-table";
import { StatusChip } from "@/components/dashboard/status-chip";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireSession } from "@/lib/auth";
import { getBookingsForUser, getPropertyById } from "@/lib/repository";
import { formatDate } from "@/lib/utils";

export default async function BookingsDashboardPage() {
  const session = await requireSession();
  const bookings = getBookingsForUser(
    session.userId,
    session.role === "agent" ? "agent" : "buyer",
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Inspection requests are structured to support approval, rescheduling, and reminders."
        title="Bookings"
      />
      <DataTable
        columns={["Property", "Scheduled", "Status", "Note"]}
        rows={bookings.map((booking) => [
          getPropertyById(booking.propertyId)?.title || booking.propertyId,
          formatDate(booking.scheduledAt),
          <StatusChip key={`${booking.id}-status`} value={booking.status} />,
          booking.note,
        ])}
        title="Viewing bookings"
      />
    </div>
  );
}
