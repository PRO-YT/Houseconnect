import Link from "next/link";

import { getSession } from "@/lib/auth";
import { mainNav } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-950">
            HouseConnect
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {mainNav.map((item) => (
              <Link
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={session ? "/dashboard" : "/auth/sign-in"} variant="ghost" size="sm">
            {session ? "Dashboard" : "Sign in"}
          </ButtonLink>
          <ButtonLink href="/auth/sign-up" size="sm">
            List with us
          </ButtonLink>
        </div>

        <MobileNav isSignedIn={Boolean(session)} />
      </div>
    </header>
  );
}
