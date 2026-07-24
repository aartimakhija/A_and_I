import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { BlogPostView } from "@/components/storefront/BlogPostView";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return { title: `${post.title} — A & I Journal`, description: post.subtitle || undefined };
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
    <BlogPostView
      post={{
        title: post.title, subtitle: post.subtitle, coverImage: post.coverImage, body: post.body,
        authorName: post.authorName, publishedAt: post.publishedAt?.toISOString() ?? null,
      }}
      products={products}
    />
  );
}
