import type { MetadataRoute } from "next";
import { products } from "@/app/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jhelumkesarco.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/our-story",
    "/contact",
    "/shipping",
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

