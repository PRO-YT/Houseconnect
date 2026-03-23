import Image from "next/image";

import type { PropertyImage } from "@/lib/types";

export function PropertyGallery({ images }: { images: PropertyImage[] }) {
  const [lead, ...rest] = images;

  if (!lead) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm leading-6 text-slate-500">
        Property media will appear here once photos are attached to the listing.
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative min-h-[420px] overflow-hidden rounded-[28px]">
        <Image
          alt={lead.alt}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          src={lead.url}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {rest.slice(0, 3).map((image) => (
          <div className="relative min-h-32 overflow-hidden rounded-[24px]" key={image.id}>
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 50vw, 30vw"
              src={image.url}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
