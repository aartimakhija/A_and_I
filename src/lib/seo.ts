import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

const SITE_NAME = "A&I — Style With Us";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://arteeandi.com";
const DEFAULT_DESCRIPTION = "Indian craft, global silhouette. Womenswear handmade in small runs across India.";
const DEFAULT_OG_IMAGE = "/og-default.png"; // real Architecture in Linen photography — regenerate this card each time the flagship capsule/look changes (was a plain text-only placeholder before)

/**
 * JSON.stringify a JSON-LD payload for safe inline embedding via
 * dangerouslySetInnerHTML. Escapes "<" so a value that happens to contain the
 * literal string "</script>" (e.g. admin-authored product or blog copy)
 * can't prematurely close the script tag or inject markup into the page.
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Strip a trailing "— A&I" / "| A&I" (however it was punctuated) from a title
 * so we never stack the brand suffix on top of one that's already there —
 * some copy (product metaTitles, static page titles) already ends in "A&I".
 * The root layout's `title.template` ("%s — A&I") is the ONE place the site
 * appends the brand name to a page-specific title; this just makes sure the
 * string we hand it is clean going in, however many times someone re-added it.
 */
function stripBrandSuffix(title: string): string {
  let t = title;
  for (;;) {
    const next = t.replace(/\s*[|—-]\s*A&I\s*$/i, "").trimEnd();
    if (next === t) break;
    t = next;
  }
  return t || title;
}

/**
 * Shared metadata builder — every page should call this instead of hand-rolling
 * a `Metadata` object, so title length, OG/Twitter tags, and canonical URLs stay
 * consistent site-wide. `path` should start with "/" (e.g. "/shop/all").
 *
 * `title` here is set as-is on `metadata.title`: Next.js applies the root
 * layout's `title.template` ("%s — A&I") on top of it automatically for the
 * rendered <title> tag, so this function must NOT also append "— A&I" —
 * doing so previously produced "Page — A&I — A&I" (or worse) site-wide.
 * OG/Twitter titles don't get that template applied by Next, so we build
 * those explicitly from the same clean title.
 */
export function pageMetadata({
  title, description, path, image, noIndex,
}: { title: string; description: string; path: string; image?: string; noIndex?: boolean }): Metadata {
  const cleanTitle = title === SITE_NAME ? title : stripBrandSuffix(title);
  const socialTitle = cleanTitle === SITE_NAME ? cleanTitle : `${cleanTitle} — A&I`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;
  return {
    title: cleanTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: socialTitle, description, url, siteName: SITE_NAME, type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image", title: socialTitle, description, images: [ogImage],
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
    { url: `${base}/bespoke`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/shop/all`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/craft`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/founder`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/faq`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/size-fit`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/shipping-returns`, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/gifting`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/press`, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${base}/sustainability`, changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${base}/visit`, changeFrequency: "monthly" as const, priority: 0.4 },
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
