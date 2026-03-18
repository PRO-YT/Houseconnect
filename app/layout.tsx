import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

import "./globals.css";

const fontSans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = buildMetadata({
  title: "Premium real estate marketplace",
  description: siteConfig.description,
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} bg-[var(--color-bg)] text-slate-950 antialiased`}>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white"
          href="#main-content"
        >
          Skip to content
        </a>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
