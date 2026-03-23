import { ButtonLink } from "@/components/ui/button";

export function DashboardHeader({
  title,
  description,
  ctaLabel,
  ctaHref,
  eyebrow,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_32%),white] p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)] lg:flex-row lg:items-center lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {ctaLabel && ctaHref ? <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink> : null}
    </div>
  );
}
