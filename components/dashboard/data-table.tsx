import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DataTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th className="px-6 py-3 font-medium" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                className={cn("border-t border-slate-100", rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/40")}
                key={`${title}-${rowIndex}`}
              >
                {row.map((cell, cellIndex) => (
                  <td className="px-6 py-4 align-top text-slate-700" key={`${title}-${rowIndex}-${cellIndex}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
