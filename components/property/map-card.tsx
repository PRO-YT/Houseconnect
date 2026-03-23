import { Card } from "@/components/ui/card";
import { buildMapEmbedUrl, buildMapSearchUrl } from "@/lib/maps";

export function MapCard({
  latitude,
  longitude,
  label,
}: {
  latitude: number;
  longitude: number;
  label: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Map-ready
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{label}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          <a
            className="mt-2 inline-flex text-sm font-medium text-teal-700"
            href={buildMapSearchUrl(latitude, longitude, label)}
            rel="noreferrer"
            target="_blank"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
      <iframe
        className="h-80 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={buildMapEmbedUrl(latitude, longitude)}
        title={label}
      />
    </Card>
  );
}
