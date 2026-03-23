import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/lib/auth";
import { getSessionUserServer } from "@/lib/server-repository";
import { capitalize } from "@/lib/utils";

export default async function ProfileDashboardPage() {
  const session = await requireSession();
  const { user, profile } = await getSessionUserServer(session);

  return (
    <div className="space-y-6">
      <DashboardHeader
        description="Review the trust signals, contact details, and profile copy that shape how other users experience your account."
        eyebrow="Profile"
        title="Identity and trust profile"
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ProfileSummaryCard profile={profile} role={session.role} user={user} />
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Profile completeness</h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-600">
            <p>Role: {capitalize(session.role)}</p>
            <p>Email verification: {user?.isEmailVerified ? "Complete" : "Pending"}</p>
            <p>Phone verification: {user?.isPhoneVerified ? "Complete" : "Pending"}</p>
            <p>Public bio: {profile?.bio ? "Added" : "Missing"}</p>
            <p>Location: {profile?.location ? "Added" : "Missing"}</p>
            <p>WhatsApp contact: {profile?.whatsappNumber ? "Added" : "Missing"}</p>
            <p>Verification status: {profile?.verificationStatus ? capitalize(profile.verificationStatus) : "Unverified"}</p>
          </div>
          <div className="mt-6 rounded-[24px] bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Profile editing is the next logical build step. This page is already wired to the stored
            account data, so adding save controls later will not require a redesign.
          </div>
        </Card>
      </div>
    </div>
  );
}
