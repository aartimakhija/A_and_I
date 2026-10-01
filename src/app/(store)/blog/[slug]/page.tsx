import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { BlogPostView } from "@/components/storefront/BlogPostView";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { pageMetadata, articleJsonLd, breadcrumbJsonLd, faqJsonLd, jsonLdHtml } from "@/lib/seo";
import { parseBlogBody, extractFaqs } from "@/lib/blog-content";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.subtitle || `${post.title} — from the A&I Journal.`,
    path: `/blog/${post.slug}`,
    image: post.coverImage || undefined,
  });
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        orderBy: { position: "asc" },
        include: { product: { include: PRODUCT_INCLUDE } },
      },
    },
  });
  if (!post || post.status !== "PUBLISHED") notFound();

  const relatedRaw = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, coverImage: true, publishedAt: true },
    take: 3,
  });

  const products = post.products
    .filter((bp) => bp.product.status === "ACTIVE")
    .map((bp) => toSFProduct(bp.product as any));

  // Any `### Question?` blocks in the body are real Q&A content the author
  // already wrote — surfaced as FAQPage structured data instead of leaving
  // it as plain, unmarked-up prose. See src/lib/blog-content.ts.
  const faqs = extractFaqs(parseBlogBody(post.body));
  const isArtee = post.authorName.toLowerCase().includes("artee");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(articleJsonLd(post)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])
      ) }} />
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd(faqs)) }} />
      )}
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <BlogPostView
        post={{
          title: post.title, subtitle: post.subtitle, coverImage: post.coverImage, body: post.body,
          authorName: post.authorName, authorUrl: isArtee ? "/founder" : null,
          publishedAt: post.publishedAt?.toISOString() ?? null,
          updatedAt: post.updatedAt.toISOString(),
        }}
        products={products}
        related={relatedRaw.map((r) => ({ slug: r.slug, title: r.title, coverImage: r.coverImage, publishedAt: r.publishedAt?.toISOString() ?? null }))}
      />
    </>
  );
}
