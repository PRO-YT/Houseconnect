import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PropertyGrid } from "@/components/property/property-grid";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import { getBookingsForUser, getBuyerShortlist, getDashboardMetricsForRole, getNotificationsForUser } from "@/lib/repository";
import { formatDate } from "@/lib/utils";

export default async function BuyerDashboardPage() {
  const session = await requireRole(["buyer"]);
  const metrics = getDashboardMetricsForRole("buyer", session.userId);
  const shortlist = getBuyerShortlist();
  const bookings = getBookingsForUser(session.userId, "buyer");
  const notifications = getNotificationsForUser(session.userId);

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/listings"
        ctaLabel="Browse listings"
        description="Save properties, compare options, follow up on inquiries, and keep your upcoming inspections organized."
        title="Buyer & renter dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-950">Saved shortlist</h2>
        <div className="mt-6">
          <PropertyGrid properties={shortlist} />
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Upcoming bookings</h2>
          <div className="mt-5 grid gap-4">
            {bookings.map((booking) => (
              <div className="rounded-[24px] border border-slate-200 p-4" key={booking.id}>
                <p className="font-semibold text-slate-950">{formatDate(booking.scheduledAt)}</p>
                <p className="mt-1 text-sm text-slate-500">{booking.note}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Notifications</h2>
          <div className="mt-5 grid gap-4">
            {notifications.map((notification) => (
              <div className="rounded-[24px] border border-slate-200 p-4" key={notification.id}>
                <p className="font-semibold text-slate-950">{notification.title}</p>
                <p className="mt-1 text-sm text-slate-500">{notification.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
