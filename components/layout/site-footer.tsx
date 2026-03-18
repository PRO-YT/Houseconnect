import Link from "next/link";

import { footerColumns, siteConfig } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div>
          <p className="text-xl font-semibold tracking-tight text-white">HouseConnect</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            Trust-first real estate discovery for seekers, verified agents, and landlords across
            Nigeria and expansion-ready African markets.
          </p>
          <div className="mt-6 space-y-1 text-sm text-slate-400">
            <p>{siteConfig.supportEmail}</p>
            <p>{siteConfig.phone}</p>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {column.title}
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {column.links.map((link) => (
                <Link className="text-slate-300 transition hover:text-white" href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">
        © 2026 HouseConnect. Built for premium property discovery, safer transactions, and cleaner
        collaboration.
      </div>
    </footer>
  );
}
