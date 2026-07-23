import { prisma } from "@/lib/prisma";

// Programmatic SEO: /shop/[category] with optional ?color= & ?occasion=
export function productJsonLd(p: any) {
  return {
    "@context": "https://schema.org", "@type": "Product",
    name: p.name, description: p.metaDesc || p.story,
    image: p.images?.map((i: any) => i.url),
    brand: { "@type": "Brand", name: "A & I" },
    offers: { "@type": "Offer", priceCurrency: "INR", price: (p.basePrice / 100).toFixed(0), availability: p.status === "ACTIVE" ? "InStock" : "OutOfStock" },
  };
}

export async function categoryPaths() {
  const cats = ["all", "ready", "craft", "linen"];
  return cats.map((category) => ({ category }));
}

export async function buildSitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const staticEntries = [
    { url: `${base}/` },
    ...["ready", "craft", "linen"].map((c) => ({ url: `${base}/shop/${c}` })),
  ];
  try {
    const products = await prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } });
    return [...staticEntries, ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: p.updatedAt }))];
  } catch {
    // A sitemap missing a few product URLs beats a 500 on /sitemap.xml.
    return staticEntries;
  }
}
