import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function MessageList({
  items,
}: {
  items: Array<{
    id: string;
    subject: string;
    preview: string;
    counterpart: string;
    createdAt: string;
  }>;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">Recent conversations</h2>
        <p className="text-sm text-slate-500">Property-linked threads</p>
      </div>
      <div className="mt-6 grid gap-4">
        {items.length ? (
          items.map((item) => (
            <div className="rounded-3xl border border-slate-200 p-4" key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-950">{item.subject}</p>
                  <p className="mt-1 text-sm text-slate-500">With {item.counterpart}</p>
                </div>
                <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.preview}</p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            No conversations yet. Threads appear here once a property inquiry or moderation note is opened.
          </div>
        )}
      </div>
    </Card>
  );
}
