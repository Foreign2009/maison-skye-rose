import type { MetadataRoute } from "next";
import { mkcCatalogue } from "./lib/mkc/catalogue";
import { COLLECTION_SPECS } from "./lib/discovery";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                                lastModified: new Date() },
    { url: `${baseUrl}/shop`,                      lastModified: new Date() },
    { url: `${baseUrl}/quiz`,                      lastModified: new Date() },
    { url: `${baseUrl}/discover`,                  lastModified: new Date() },
    { url: `${baseUrl}/collections/skye`,          lastModified: new Date() },
    { url: `${baseUrl}/collections/rose`,          lastModified: new Date() },
    { url: `${baseUrl}/collections/elite`,         lastModified: new Date() },
    { url: `${baseUrl}/best-sellers`,              lastModified: new Date() },
    { url: `${baseUrl}/new-arrivals`,              lastModified: new Date() },
    { url: `${baseUrl}/wholesale`,                 lastModified: new Date() },
    { url: `${baseUrl}/about`,                     lastModified: new Date() },
    { url: `${baseUrl}/contact`,                   lastModified: new Date() },
    { url: `${baseUrl}/faq`,                       lastModified: new Date() },
    { url: `${baseUrl}/delivery`,                  lastModified: new Date() },
    { url: `${baseUrl}/privacy`,                   lastModified: new Date() },
    { url: `${baseUrl}/terms`,                     lastModified: new Date() },
  ];

  const productRoutes: MetadataRoute.Sitemap = mkcCatalogue.map((k) => ({
    url: `${baseUrl}/product/${k.slug}`,
    lastModified: new Date(),
  }));

  const discoverRoutes: MetadataRoute.Sitemap = COLLECTION_SPECS.map((s) => ({
    url: `${baseUrl}/discover/${s.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes, ...discoverRoutes];
}
