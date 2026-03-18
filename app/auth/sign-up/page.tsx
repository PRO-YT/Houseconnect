import Link from "next/link";

import { SignUpForm } from "@/components/forms/sign-up-form";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign up",
  description: "Create a buyer, agent, or landlord account on HouseConnect.",
  path: "/auth/sign-up",
});

export default function SignUpPage() {
  return (
    <section className="section-space">
      <PageShell>
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-8">
            <p className="eyebrow text-sm font-semibold text-teal-700">Get started</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Create a role-aware account.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Choose the workflow that fits you today. Buyers can search and compare, agents can
              manage inventory and monetization, and landlords can submit properties securely.
            </p>
            <div className="mt-8 grid gap-4 text-sm text-slate-600">
              <p>Buyer / renter: save, compare, inquire, and book inspections.</p>
              <p>Agent: verify identity, publish listings, handle leads, and subscribe.</p>
              <p>Landlord: submit properties, upload proof, and work through assigned agents.</p>
            </div>
          </Card>
          <Card className="p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Open an account</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The MVP instantly creates a signed session so you can enter the product without extra friction.
            </p>
            <div className="mt-8">
              <SignUpForm />
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Already have an account?{" "}
              <Link className="font-semibold text-teal-700" href="/auth/sign-in">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </PageShell>
    </section>
  );
}
