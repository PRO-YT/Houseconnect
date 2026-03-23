import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPinIcon, ShieldIcon, StarIcon } from "@/components/ui/icons";
import type { Role, User, UserProfile } from "@/lib/types";
import { capitalize } from "@/lib/utils";

export function ProfileSummaryCard({
  role,
  user,
  profile,
  ctaHref,
  ctaLabel,
}: {
  role: Exclude<Role, "guest">;
  user: User | null;
  profile: UserProfile | null;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-500">Profile information will appear here once available.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-950 px-6 py-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/20">
              <Image alt={user.fullName} className="object-cover" fill sizes="64px" src={user.avatar} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-300">
                {capitalize(role)} profile
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{user.fullName}</h2>
              <p className="mt-1 text-sm text-slate-300">{profile?.companyName || user.email}</p>
            </div>
          </div>
          <Badge className="self-start bg-white/10 text-white ring-white/20" tone="neutral">
            {profile?.verificationStatus ? capitalize(profile.verificationStatus) : "Unverified"}
          </Badge>
        </div>
      </div>
      <div className="grid gap-4 p-6">
        <div className="grid gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-teal-700" />
            <span>{profile?.location || "Location can be added in profile settings."}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4 text-emerald-600" />
            <span>
              Email {user.isEmailVerified ? "verified" : "pending"} and phone{" "}
              {user.isPhoneVerified ? "verified" : "pending"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StarIcon className="h-4 w-4 text-amber-500" />
            <span>Trust score: {profile?.trustScore ?? 0}/100</span>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">
          {profile?.bio || "Add a short bio to strengthen trust and help the marketplace explain who you are."}
        </p>
        {profile?.preferences?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.preferences.slice(0, 6).map((item) => (
              <span
                className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
        {ctaHref && ctaLabel ? (
          <div>
            <ButtonLink href={ctaHref} variant="secondary">
              {ctaLabel}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
