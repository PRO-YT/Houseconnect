import Image from "next/image";
import Link from "next/link";

import { MarketingHero } from "@/components/layout/marketing-hero";
import { PageShell } from "@/components/layout/page-shell";
import { PropertyGrid } from "@/components/property/property-grid";
import { SearchHero } from "@/components/property/search-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { listingCategories, supportedCities } from "@/lib/constants";
import { demoProfiles, demoUsers } from "@/lib/data/demo";
import { getLandingContent } from "@/lib/repository";
import { getFeaturedPropertiesServer } from "@/lib/server-repository";
import { formatCompactNumber } from "@/lib/utils";

export default async function HomePage() {
  const featured = (await getFeaturedPropertiesServer()).slice(0, 3);
  const landing = getLandingContent();
  const verifiedAgents = demoUsers
    .filter((user) => user.role === "agent")
    .map((user) => ({ user, profile: demoProfiles.find((profile) => profile.userId === user.id) }))
    .slice(0, 2);

  return (
    <>
      <MarketingHero
        description="Discover vetted homes, connect with verified agents, and keep landlord submissions inside a safer, moderated marketplace built for modern African property transactions."
        eyebrow="Trust-first marketplace"
        title="A premium real estate platform for serious seekers, agents, and landlords."
      >
        <div className="hero-grid">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <Badge tone="accent">Verified agent network</Badge>
              <Badge tone="success">Reviewed listings</Badge>
              <Badge tone="neutral">WhatsApp-ready contact</Badge>
            </div>
            <SearchHero />
            <div className="mt-6 flex flex-wrap gap-3">
              {supportedCities.map((city) => (
                <Link className="pill" href={`/listings?location=${encodeURIComponent(city)}`} key={city}>
                  {city}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Marketplace quality</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">94%</p>
                </div>
                <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                  Verified agent ratio
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Live listings</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {formatCompactNumber(1284)}
                  </p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Avg. first response</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">17 min</p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-72">
                <Image
                  alt="Premium building facade"
                  className="object-cover"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Built for confidence
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  Clean fee disclosure, trust badges, and clear moderation states reduce confusion.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </MarketingHero>

      <section className="section-space pt-0">
        <PageShell>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Search smarter", "Use advanced filters, URL-persistent search, and premium listing cards."],
              ["Connect safer", "Message verified agents and keep inquiries inside the platform."],
              ["Inspect faster", "Book viewings and track status without spreadsheet back-and-forth."],
              ["Scale cleaner", "Subscriptions, featured placements, and moderation are built in."],
            ].map(([title, description]) => (
              <Card className="p-6" key={title}>
                <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>

      <section className="section-space bg-white">
        <PageShell>
          <SectionHeading
            align="center"
            eyebrow="Featured now"
            title="High-trust properties that convert quickly"
            description="Premium cards, accurate details, and reviewed media to help seekers move with confidence."
          />
          <div className="mt-10">
            <PropertyGrid properties={featured} />
          </div>
        </PageShell>
      </section>

      <section className="section-space">
        <PageShell>
          <SectionHeading
            eyebrow="Browse by category"
            title="Search the way real seekers think"
            description="Quick entry points for common intent: rentals, sales, starter apartments, land, and commercial stock."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
            {listingCategories.map((category) => (
              <Link
                className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 text-center text-sm font-semibold text-slate-800 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.2)] transition hover:-translate-y-1"
                href="/listings"
                key={category}
              >
                {category}
              </Link>
            ))}
          </div>
        </PageShell>
      </section>

      <section className="section-space bg-white">
        <PageShell>
          <SectionHeading
            eyebrow="How it works"
            title="A clearer path for every role"
            description="The marketplace gives seekers, agents, and landlords the exact level of structure they need without unnecessary friction."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              [
                "1. Search and shortlist",
                "Guests browse freely, then sign up only when they want to save, compare, message, or book.",
              ],
              [
                "2. Verify and connect",
                "Agents surface trust badges and landlord-backed listings while seekers route contact through moderated channels.",
              ],
              [
                "3. Close with confidence",
                "Viewings, lead statuses, fee transparency, and subscription workflows keep the marketplace organized.",
              ],
            ].map(([title, text]) => (
              <Card className="p-6" key={title}>
                <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>

      <section className="section-space">
        <PageShell>
          <SectionHeading
            eyebrow="Trust signals"
            title="Made for markets where credibility matters"
            description="HouseConnect bakes verification, moderation, and transparency into the browsing and conversion experience."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <Card className="p-6">
              <div className="grid gap-4">
                {landing.trustHighlights.map((item) => (
                  <div className="rounded-[24px] bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-700" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6">
              {verifiedAgents.map((entry) => (
                <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center" key={entry.user.id}>
                  <div className="relative h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      alt={entry.user.fullName}
                      className="object-cover"
                      fill
                      sizes="80px"
                      src={entry.user.avatar}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-slate-950">{entry.user.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">{entry.profile?.companyName}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{entry.profile?.bio}</p>
                  </div>
                  <Badge tone="success">Verified agent</Badge>
                </Card>
              ))}
            </div>
          </div>
        </PageShell>
      </section>

      <section className="section-space bg-white">
        <PageShell>
          <SectionHeading
            align="center"
            eyebrow="Testimonials"
            title="What users notice immediately"
            description="The strongest early feedback is about clarity, speed, and feeling safer than open classifieds."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {landing.testimonials.map((item) => (
              <Card className="p-6" key={item.id}>
                <p className="text-base leading-8 text-slate-700">“{item.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>

      <section className="section-space">
        <PageShell>
          <Card className="bg-slate-950 px-8 py-10 text-white md:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow text-sm font-semibold text-teal-300">Ready to launch</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  Join as a seeker, verified agent, or landlord.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  The MVP already supports discovery, trust workflows, listings, dashboards,
                  bookings, and monetization-ready subscriptions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/auth/sign-up">Create account</ButtonLink>
                <ButtonLink href="/pricing" variant="secondary">
                  View pricing
                </ButtonLink>
              </div>
            </div>
          </Card>
        </PageShell>
      </section>
    </>
  );
}
