import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { faqItems } from "@/lib/data/demo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Answers to common questions about listings, trust, billing, and user roles on HouseConnect.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <MarketingHero
        description="These are the questions we expect early users to ask when choosing a safer real estate marketplace."
        eyebrow="FAQ"
        title="Answers about search, trust, billing, and moderation."
      />
      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-5">
            {faqItems.map((item) => (
              <Card className="p-6" key={item.question}>
                <h2 className="text-lg font-semibold text-slate-950">{item.question}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>
    </>
  );
}
