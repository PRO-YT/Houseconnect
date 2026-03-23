import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MonetizationCard({
  title,
  description,
  items,
  ctaHref,
  ctaLabel,
  badge,
}: {
  title: string;
  description: string;
  items: string[];
  ctaHref?: string;
  ctaLabel?: string;
  badge?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {badge ? <Badge tone="accent">{badge}</Badge> : null}
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" key={item}>
            {item}
          </div>
        ))}
      </div>
      {ctaHref && ctaLabel ? (
        <div className="mt-5">
          <ButtonLink href={ctaHref} variant="secondary">
            {ctaLabel}
          </ButtonLink>
        </div>
      ) : null}
    </Card>
  );
}
