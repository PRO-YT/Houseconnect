import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      {trend ? <p className="mt-2 text-sm text-teal-700">{trend}</p> : null}
    </Card>
  );
}
