"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const roleLinks: Record<Exclude<Role, "guest">, Array<{ href: string; label: string }>> = {
  buyer: [
    { href: "/dashboard/buyer", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/messages", label: "Messages" },
    { href: "/dashboard/bookings", label: "Bookings" },
  ],
  agent: [
    { href: "/dashboard/agent", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/listings", label: "Listings" },
    { href: "/dashboard/messages", label: "Lead inbox" },
    { href: "/dashboard/bookings", label: "Calendar" },
    { href: "/dashboard/subscriptions", label: "Subscription" },
  ],
  landlord: [
    { href: "/dashboard/landlord", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/submissions", label: "Submissions" },
    { href: "/dashboard/messages", label: "Messages" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/listings", label: "Moderation" },
    { href: "/dashboard/messages", label: "Reports & messages" },
    { href: "/dashboard/subscriptions", label: "Plans & billing" },
  ],
};

export function DashboardSidebar({
  role,
}: {
  role: Exclude<Role, "guest">;
}) {
  const pathname = usePathname();

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)]">
      <div className="rounded-[24px] bg-slate-950 px-4 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          {role} workspace
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Navigate the role-specific tools, profile controls, and monetization surfaces from one place.
        </p>
      </div>
      <nav className="mt-4 grid gap-2">
        {roleLinks[role].map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              className={cn(
                "rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-slate-950 text-white"
                  : "text-slate-700 hover:bg-slate-100",
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
