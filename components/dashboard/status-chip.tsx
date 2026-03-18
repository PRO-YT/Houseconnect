import { Badge } from "@/components/ui/badge";

const toneMap: Record<string, "neutral" | "success" | "warning" | "danger" | "accent"> = {
  approved: "success",
  verified: "success",
  active: "success",
  pending: "warning",
  "pending-review": "warning",
  "under-review": "warning",
  contacted: "accent",
  "inspection-scheduled": "accent",
  new: "neutral",
  rejected: "danger",
  archived: "neutral",
  expired: "neutral",
  resolved: "success",
  reviewing: "accent",
};

export function StatusChip({ value }: { value: string }) {
  return <Badge tone={toneMap[value] || "neutral"}>{value.replace(/-/g, " ")}</Badge>;
}
