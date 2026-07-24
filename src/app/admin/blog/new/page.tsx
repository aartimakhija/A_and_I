import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function NewBlogPost() {
  const products = await prisma.product.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  return (
    <>
      <h1>New post</h1>
      <div style={{ marginTop: 24 }}>
        <BlogPostForm allProducts={products} />
      </div>
    </>
  );
}
