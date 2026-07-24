import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { BlogPostView } from "@/components/storefront/BlogPostView";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { pageMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.subtitle || `${post.title} — from the A&I Journal.`,
    path: `/blog/${post.slug}`,
    image: post.coverImage || undefined,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
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

  const products = post.products
    .filter((bp) => bp.product.status === "ACTIVE")
    .map((bp) => toSFProduct(bp.product as any));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])
      ) }} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <BlogPostView
        post={{
          title: post.title, subtitle: post.subtitle, coverImage: post.coverImage, body: post.body,
          authorName: post.authorName, publishedAt: post.publishedAt?.toISOString() ?? null,
          updatedAt: post.updatedAt.toISOString(),
        }}
        products={products}
      />
    </>
  );
}
