import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants";

export function buildMetadata(config: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${siteConfig.url}${config.path ?? ""}`;

  return {
    title: `${config.title} | ${siteConfig.name}`,
    description: config.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url,
      siteName: siteConfig.name,
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
  };
}
