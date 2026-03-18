import { Card } from "@/components/ui/card";
import { CheckCircleIcon } from "@/components/ui/icons";

export function ChecklistCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div className="flex items-start gap-3 text-sm text-slate-600" key={item}>
            <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
