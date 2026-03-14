import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, siteNavigationLinks } from "@/app/lib/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Jhelum Kesar",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fff8f0",
    theme_color: "#8b1e1e",
    icons: [
      {
        src: "/icon.png",
        sizes: "1763x1763",
        type: "image/png",
      },
      {
        src: "/logo-final.png",
        sizes: "1763x1763",
        type: "image/png",
      },
    ],
    shortcuts: siteNavigationLinks.map((link) => ({
      name: link.name,
      url: link.href,
      description: `${link.name} on ${SITE_NAME}`,
    })),
    id: SITE_URL,
  };
}
