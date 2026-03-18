import { PageShell } from "@/components/layout/page-shell";

export function MarketingHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="section-space">
      <PageShell>
        <div className="glass-panel bg-grid overflow-hidden p-8 md:p-12">
          <p className="eyebrow text-sm font-semibold text-teal-700">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </PageShell>
    </section>
  );
}
