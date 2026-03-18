import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: "Why HouseConnect exists and how the marketplace is designed around trust and conversion.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        description="HouseConnect was designed for markets where real estate demand is strong, trust can be fragile, and the best products reduce friction without removing accountability."
        eyebrow="About HouseConnect"
        title="We build cleaner property transactions by making trust visible."
      />
      <section className="section-space pt-0">
        <PageShell>
          <SectionHeading
            eyebrow="What we believe"
            title="A marketplace should feel premium, but it also has to feel safe."
            description="That means fewer dead ends, better moderation, honest fee visibility, and the right balance between discovery and gated actions."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              ["Trust first", "Verification, moderation, and disclosure should be obvious, not hidden in support emails."],
              ["Fast discovery", "Search has to work on low-bandwidth mobile connections and still feel premium on desktop."],
              ["Role clarity", "Seekers, agents, landlords, and admins each need focused workflows rather than a one-size-fits-none dashboard."],
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
