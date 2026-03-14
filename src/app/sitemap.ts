import type { MetadataRoute } from "next";
import { products } from "@/app/lib/products";
import { SITE_URL } from "@/app/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/categories",
    "/our-story",
    "/contact",
    "/shipping",
    "/whatsapp",
  ].map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
