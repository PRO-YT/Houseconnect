"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-padded section-space">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-rose-200 bg-white p-10 text-center shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">
          Something went wrong
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          We hit a temporary issue.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Please retry the last action. If the problem continues, use the contact page and our
          support team can investigate.
        </p>
        <div className="mt-8">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
