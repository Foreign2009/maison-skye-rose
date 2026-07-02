import type { MetadataRoute } from "next";
import { fragrances } from "./data/fragrances";

function toSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/quiz`, lastModified: new Date() },
    { url: `${baseUrl}/collections/skye`, lastModified: new Date() },
    { url: `${baseUrl}/collections/rose`, lastModified: new Date() },
    { url: `${baseUrl}/collections/elite`, lastModified: new Date() },
    { url: `${baseUrl}/best-sellers`, lastModified: new Date() },
    { url: `${baseUrl}/new-arrivals`, lastModified: new Date() },
    { url: `${baseUrl}/wholesale`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/delivery`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
  ];

  const productRoutes: MetadataRoute.Sitemap = fragrances.map((f) => ({
    url: `${baseUrl}/product/${toSlug(f.title)}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
