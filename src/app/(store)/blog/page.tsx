import { prisma } from "@/lib/prisma";
import { BlogList } from "@/components/storefront/BlogList";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Journal",
  description: "Craft notes, styling edits, and the stories behind the pieces — from the A&I studio.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, subtitle: true, coverImage: true, authorName: true, publishedAt: true },
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }])) }} />
      <BlogList posts={posts.map((p) => ({ ...p, publishedAt: p.publishedAt?.toISOString() ?? null }))} />
    </>
  );
}
