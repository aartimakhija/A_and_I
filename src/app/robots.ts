import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://arteeandi.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/vendor", "/account", "/api", "/checkout", "/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
