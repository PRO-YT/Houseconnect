import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: "How HouseConnect handles user information, messages, and compliance-conscious data workflows.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <MarketingHero
        description="The MVP is designed to keep private data scoped, secure, and aligned with practical marketplace needs."
        eyebrow="Privacy"
        title="A privacy-conscious approach to listings, messages, and verification data."
      />
      <section className="section-space pt-0">
        <PageShell>
          <Card className="p-6">
            <div className="grid gap-4 text-sm leading-7 text-slate-600">
              <p>We collect account, inquiry, booking, and verification data needed to operate the marketplace responsibly.</p>
              <p>Sensitive actions are intended to be logged, and secrets are kept on the server side only.</p>
              <p>Contact details are revealed carefully and can be routed through platform messaging rather than exposed broadly.</p>
              <p>Admins can review reported listings, suspicious activity, and submitted verification documents for safety and compliance.</p>
            </div>
          </Card>
        </PageShell>
      </section>
    </>
  );
}
