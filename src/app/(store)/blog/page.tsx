import { prisma } from "@/lib/prisma";
import { BlogList } from "@/components/storefront/BlogList";

export const metadata = { title: "Journal — A & I", description: "Craft notes, styling edits, and the stories behind the pieces." };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, subtitle: true, coverImage: true, authorName: true, publishedAt: true },
  });
  return <BlogList posts={posts.map((p) => ({ ...p, publishedAt: p.publishedAt?.toISOString() ?? null }))} />;
}
