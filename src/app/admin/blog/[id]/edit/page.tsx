import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function EditBlogPost(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [post, products] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { products: { orderBy: { position: "asc" }, include: { product: { select: { id: true, name: true } } } } },
    }),
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();

  return (
    <>
      <h1>Edit {post.title}</h1>
      <div style={{ marginTop: 24 }}>
        <BlogPostForm allProducts={products} post={post} />
      </div>
    </>
  );
}
