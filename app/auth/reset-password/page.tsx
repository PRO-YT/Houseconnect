import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reset password",
  description: "Reset your HouseConnect password with a tokenized link.",
  path: "/auth/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <section className="section-space">
      <PageShell>
        <div className="mx-auto max-w-2xl">
          <Card className="p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Reset password flow scaffolded
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The backend route validates tokenized reset requests and can be wired to your email
              provider and database session store during deployment.
            </p>
          </Card>
        </div>
      </PageShell>
    </section>
  );
}
