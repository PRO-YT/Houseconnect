import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";
import { demoProperties } from "@/lib/data/demo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/how-it-works",
    "/for-agents",
    "/for-landlords",
    "/pricing",
    "/contact",
    "/faq",
    "/safety",
    "/terms",
    "/privacy",
    "/listings",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const listings = demoProperties.map((property) => ({
    url: `${siteConfig.url}/listings/${property.slug}`,
    lastModified: new Date(property.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...routes, ...listings];
}
