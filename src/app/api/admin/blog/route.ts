import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  await requireRole(["ADMIN"]);
  const posts = await prisma.blogPost.findMany({
    include: { products: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!b.title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const slug = (b.slug || b.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const post = await prisma.blogPost.create({
    data: {
      slug, title: b.title, subtitle: b.subtitle || null, coverImage: b.coverImage || null,
      body: b.body || "", status: b.status || "DRAFT",
      authorName: b.authorName || "A&I Editorial",
      publishedAt: b.status === "PUBLISHED" ? new Date() : null,
      products: { create: (b.productIds ?? []).map((productId: string, i: number) => ({ productId, position: i })) },
    },
  });
  return NextResponse.json(post, { status: 201 });
}
