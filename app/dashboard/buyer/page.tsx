import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PropertyGrid } from "@/components/property/property-grid";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireRole } from "@/lib/auth";
import {
  getBookingsForUserServer,
  getBuyerShortlistServer,
  getNotificationsForUserServer,
  getSessionUserServer,
} from "@/lib/server-repository";
import { formatDate } from "@/lib/utils";

export default async function BuyerDashboardPage() {
  const session = await requireRole(["buyer"]);
  const [{ user, profile }, shortlist, bookings, notifications] = await Promise.all([
    getSessionUserServer(session),
    getBuyerShortlistServer(),
    getBookingsForUserServer(session.userId, "buyer"),
    getNotificationsForUserServer(session.userId),
  ]);
  const metrics = [
    { label: "Saved shortlist", value: String(shortlist.length), trend: "Ready to compare" },
    {
      label: "Upcoming viewings",
      value: String(bookings.filter((booking) => booking.status !== "completed").length),
      trend: bookings[0] ? `Next: ${formatDate(bookings[0].scheduledAt)}` : "No booking yet",
    },
    {
      label: "Unread alerts",
      value: String(notifications.filter((notification) => !notification.isRead).length),
      trend: "Messages, pricing changes, and viewing updates",
    },
    {
      label: "Tracked markets",
      value: String(new Set(shortlist.map((property) => property.city)).size || 1),
      trend: "Spread across your preferred neighborhoods",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        ctaHref="/listings"
        ctaLabel="Browse listings"
        description="Save properties, compare options, follow up on inquiries, and keep your inspections and decisions organized in one calmer workflow."
        eyebrow="Renter workspace"
        title="Buyer and renter dashboard"
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
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Decision support</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-600">
            <p>Compare fee breakdowns before you commit to a viewing.</p>
            <p>Keep high-trust listings at the top of your shortlist by looking for reviewed media and verified agents.</p>
            <p>Use the messaging workspace to keep promises, documents, and inspection details in one thread.</p>
            <p>Shortlist properties across a few neighborhoods so you can negotiate with clearer market context.</p>
          </div>
          <div className="mt-6 rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">Search posture</p>
            <p className="mt-2 text-2xl font-semibold">Ready for serious inquiries</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your workspace is set up to move from discovery to viewing without losing track of pricing, trust signals, or agent follow-up.
            </p>
          </div>
        </Card>
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
