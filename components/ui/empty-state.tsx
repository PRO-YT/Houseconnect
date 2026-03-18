import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      {ctaLabel && ctaHref ? (
        <div className="mt-5">
          <ButtonLink href={ctaHref} variant="secondary">
            {ctaLabel}
          </ButtonLink>
        </div>
      ) : null}
    </Card>
  );
}
