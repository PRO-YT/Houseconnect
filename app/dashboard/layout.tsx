import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { PageShell } from "@/components/layout/page-shell";
import { SignOutButton } from "@/components/forms/sign-out-button";
import { requireSession } from "@/lib/auth";
import { getSessionUser } from "@/lib/repository";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const { user, profile } = getSessionUser(session);

  return (
    <section className="section-space">
      <PageShell>
        <div className="dashboard-grid">
          <div className="space-y-6">
            <DashboardSidebar role={session.role} />
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)]">
              <p className="text-sm font-semibold text-slate-950">{user?.fullName || session.fullName}</p>
              <p className="mt-1 text-sm text-slate-500">{profile?.location || session.email}</p>
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
