import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "How it works",
  description: "See how HouseConnect connects seekers, agents, landlords, and admins inside one moderated workflow.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <MarketingHero
        description="HouseConnect turns discovery, inquiry, moderation, and monetization into one connected experience instead of scattered chats and spreadsheets."
        eyebrow="How it works"
        title="A practical flow for property seekers, agents, landlords, and marketplace ops."
      />
      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-6 lg:grid-cols-4">
            {[
              ["Seekers browse", "Search listings, compare options, save favorites, and request viewings after signup."],
              ["Agents manage", "List inventory, receive leads, coordinate inspections, and upgrade plans for visibility."],
              ["Landlords submit", "Upload property data, attach documents, request an agent, and track approval states."],
              ["Admins moderate", "Verify users, review listings, resolve reports, and manage growth metrics."],
            ].map(([title, text]) => (
              <Card className="p-6" key={title}>
                <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>
    </>
  );
}
