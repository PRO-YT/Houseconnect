import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Forgot password",
  description: "Request a password reset link from HouseConnect.",
  path: "/auth/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <section className="section-space">
      <PageShell>
        <div className="mx-auto max-w-2xl">
          <Card className="p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Password reset flow scaffolded
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The API endpoint is ready for an email provider abstraction. In a production setup,
              this page would submit your email and deliver a signed reset link.
            </p>
          </Card>
        </div>
      </PageShell>
    </section>
  );
}
