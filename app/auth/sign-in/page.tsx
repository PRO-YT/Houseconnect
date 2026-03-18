import Link from "next/link";

import { SignInForm } from "@/components/forms/sign-in-form";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Access your buyer, agent, landlord, or admin dashboard on HouseConnect.",
  path: "/auth/sign-in",
});

export default function SignInPage() {
  return (
    <section className="section-space">
      <PageShell>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="bg-slate-950 p-8 text-white">
            <p className="eyebrow text-sm font-semibold text-teal-300">Sign in</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Welcome back.</h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Use one of the seeded demo accounts to explore the full role-based experience.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-slate-300">
              <p>`buyer@houseconnect.africa`</p>
              <p>`agent@houseconnect.africa`</p>
              <p>`landlord@houseconnect.africa`</p>
              <p>`admin@houseconnect.africa`</p>
            </div>
          </Card>
          <Card className="p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Access dashboard</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Secure demo login with signed session cookies and role-based route protection.
            </p>
            <div className="mt-8">
              <SignInForm />
            </div>
            <p className="mt-6 text-sm text-slate-500">
              No account yet?{" "}
              <Link className="font-semibold text-teal-700" href="/auth/sign-up">
                Create one
              </Link>
            </p>
          </Card>
        </div>
      </PageShell>
    </section>
  );
}
