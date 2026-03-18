"use client";

import Link from "next/link";
import { useState } from "react";

import { mainNav } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

export function MobileNav({
  isSignedIn,
}: {
  isSignedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-expanded={open}
        aria-label="Toggle navigation"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/30 transition",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[88vw] max-w-sm border-l border-slate-200 bg-white p-6 transition",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link className="text-lg font-semibold tracking-tight text-slate-950" href="/">
            HouseConnect
          </Link>
          <button
            aria-label="Close navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200"
            onClick={() => setOpen(false)}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-3">
          {mainNav.map((item) => (
            <Link
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 grid gap-3">
          <ButtonLink href={isSignedIn ? "/dashboard" : "/auth/sign-in"} variant="secondary">
            {isSignedIn ? "Dashboard" : "Sign in"}
          </ButtonLink>
          <ButtonLink href="/auth/sign-up">Get started</ButtonLink>
        </div>
      </aside>
    </div>
  );
}
