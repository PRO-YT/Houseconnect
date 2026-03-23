import { DataTable } from "@/components/dashboard/data-table";
import { StatusChip } from "@/components/dashboard/status-chip";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { requireSession } from "@/lib/auth";
import { getBookingsForUserServer, getPropertyByIdServer } from "@/lib/server-repository";
import { formatDate } from "@/lib/utils";

export default async function BookingsDashboardPage() {
  const session = await requireSession();
  const bookings = await getBookingsForUserServer(
    session.userId,
    session.role === "agent" ? "agent" : "buyer",
  );
  const propertyTitles = new Map(
    (
      await Promise.all(
        bookings.map(async (booking) => [booking.propertyId, (await getPropertyByIdServer(booking.propertyId))?.title] as const),
      )
    ).filter((entry) => Boolean(entry[1])),
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Inspection requests are structured to support approval, rescheduling, and reminders."
        eyebrow="Calendar"
        title="Bookings"
      />
      <DataTable
        columns={["Property", "Scheduled", "Status", "Note"]}
        rows={bookings.map((booking) => [
          propertyTitles.get(booking.propertyId) || booking.propertyId,
          formatDate(booking.scheduledAt),
          <StatusChip key={`${booking.id}-status`} value={booking.status} />,
          booking.note,
        ])}
        title="Viewing bookings"
      />
    </div>
  );
}
