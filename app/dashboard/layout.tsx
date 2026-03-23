import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { PageShell } from "@/components/layout/page-shell";
import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { SignOutButton } from "@/components/forms/sign-out-button";
import { requireSession } from "@/lib/auth";
import { getSessionUserServer } from "@/lib/server-repository";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const { user, profile } = await getSessionUserServer(session);

  return (
    <section className="section-space">
      <PageShell>
        <div className="dashboard-grid">
          <div className="space-y-6">
            <DashboardSidebar role={session.role} />
            <ProfileSummaryCard
              ctaHref="/dashboard/profile"
              ctaLabel="Open profile"
              profile={profile}
              role={session.role}
              user={user}
            />
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Security snapshot
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <p>Signed session cookie active for this browser.</p>
                <p>Email verification: {user?.isEmailVerified ? "complete" : "pending"}</p>
                <p>Phone verification: {user?.isPhoneVerified ? "complete" : "pending"}</p>
              </div>
              <div className="mt-5">
                <SignOutButton />
              </div>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </PageShell>
    </section>
  );
}
