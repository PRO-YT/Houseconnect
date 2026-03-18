import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth";

export default async function DashboardRouterPage() {
  const session = await requireSession();
  redirect(
    session.role === "buyer"
      ? "/dashboard/buyer"
      : session.role === "agent"
        ? "/dashboard/agent"
        : session.role === "landlord"
          ? "/dashboard/landlord"
          : "/dashboard/admin",
  );
}
