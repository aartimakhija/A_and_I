import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

const SITE_NAME = "A&I — Style With Us";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const DEFAULT_DESCRIPTION = "Indian craft, global silhouette. Womenswear handmade in small runs across India.";
const DEFAULT_OG_IMAGE = "/og-default.png"; // see /public/og-default.png — swap for real brand photography when available

/**
 * Shared metadata builder — every page should call this instead of hand-rolling
 * a `Metadata` object, so title length, OG/Twitter tags, and canonical URLs stay
 * consistent site-wide. `path` should start with "/" (e.g. "/shop/all").
 */
export function pageMetadata({
  title, description, path, image, noIndex,
}: { title: string; description: string; path: string; image?: string; noIndex?: boolean }): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} — A&I`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle, description, url, siteName: SITE_NAME, type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image", title: fullTitle, description, images: [ogImage],
    },
  };
}

// ── Structured data (JSON-LD) ───────────────────────────────────────────
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org", "@type": "Organization",
    name: "A&I", url: SITE_URL, logo: `${SITE_URL}/icon.png`,
    sameAs: [], // add real social profile URLs here once live
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org", "@type": "WebSite",
    name: SITE_NAME, url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop/all?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem", position: i + 1, name: item.name, item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqJsonLd(qas: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question", name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}

export function articleJsonLd(post: { title: string; subtitle: string | null; coverImage: string | null; authorName: string; publishedAt: Date | null; updatedAt: Date; slug: string }) {
  return {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.subtitle || undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    author: { "@type": "Organization", name: post.authorName },
    publisher: { "@type": "Organization", name: "A&I", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

export function productJsonLd(p: any) {
  return {
    "@context": "https://schema.org", "@type": "Product",
    name: p.name, description: p.metaDesc || p.story,
    image: p.images?.map((i: any) => i.url),
    brand: { "@type": "Brand", name: "A&I" },
    offers: { "@type": "Offer", priceCurrency: "INR", price: (p.basePrice / 100).toFixed(0), availability: p.status === "ACTIVE" ? "InStock" : "OutOfStock", url: `${SITE_URL}/products/${p.slug}` },
  };
}

// ── Sitemap / category paths (programmatic SEO) ─────────────────────────
export async function categoryPaths() {
  const { getCategories } = await import("@/lib/categories");
  const categories = await getCategories();
  return ["all", ...categories.map((c) => c.slug)].map((category) => ({ category }));
}

export async function buildSitemap() {
  const base = SITE_URL;
  const staticEntries = [
    { url: `${base}/`, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/lookbook`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${base}/fit-quiz`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/shop/all`, changeFrequency: "daily" as const, priority: 0.9 },
  ];
  try {
    const { getCategories } = await import("@/lib/categories");
    const [products, posts, categories] = await Promise.all([
      prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      getCategories(),
    ]);
    return [
      ...staticEntries,
      ...categories.map((c) => ({ url: `${base}/shop/${c.slug}`, changeFrequency: "daily" as const, priority: 0.9 })),
      ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
      ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
  } catch {
    // A sitemap missing a few dynamic URLs beats a 500 on /sitemap.xml.
    return staticEntries;
  }
}
