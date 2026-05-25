import type { MetadataRoute } from "next";

const siteUrl = "https://resumai.services";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/sign-in", "/sign-up", "/app/settings"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
