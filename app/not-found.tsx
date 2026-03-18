import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-padded section-space">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
          Listing not found
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          That page is no longer available.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The listing may have expired, been archived, or moved into moderation review.
        </p>
        <div className="mt-8">
          <ButtonLink href="/listings">Browse active listings</ButtonLink>
        </div>
      </div>
    </div>
  );
}
