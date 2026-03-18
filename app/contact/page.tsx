import { ContactForm } from "@/components/forms/contact-form";
import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Reach HouseConnect for support, partnerships, or compliance inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <MarketingHero
        description="Contact support for account help, listing moderation, agent verification, partnerships, or operational questions."
        eyebrow="Contact"
        title="Talk to the team behind HouseConnect."
      />
      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Reach us directly</h2>
              <div className="mt-5 grid gap-4 text-sm text-slate-600">
                <p>{siteConfig.supportEmail}</p>
                <p>{siteConfig.phone}</p>
                <p>WhatsApp: {siteConfig.whatsapp}</p>
                <p>Mon to Sat, 8:00 AM - 7:00 PM WAT</p>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-950">Send a message</h2>
              <div className="mt-5">
                <ContactForm />
              </div>
            </Card>
          </div>
        </PageShell>
      </section>
    </>
  );
}
