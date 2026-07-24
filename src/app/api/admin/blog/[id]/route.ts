import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    include: { products: { orderBy: { position: "asc" }, include: { product: { select: { id: true, name: true } } } } },
  });
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const b = await req.json();
  const data: any = {};
  for (const f of ["title", "subtitle", "coverImage", "body", "authorName"]) {
    if (b[f] !== undefined) data[f] = b[f];
  }
  if (b.status !== undefined) {
    data.status = b.status;
    if (b.status === "PUBLISHED" && !existing.publishedAt) data.publishedAt = new Date();
  }
  const post = await prisma.blogPost.update({ where: { id: params.id }, data });

  if (Array.isArray(b.productIds)) {
    await prisma.blogPostProduct.deleteMany({ where: { postId: post.id } });
    await prisma.blogPostProduct.createMany({
      data: b.productIds.map((productId: string, i: number) => ({ postId: post.id, productId, position: i })),
    });
  }

  const full = await prisma.blogPost.findUnique({
    where: { id: post.id },
    include: { products: { orderBy: { position: "asc" }, include: { product: { select: { id: true, name: true } } } } },
  });
  return NextResponse.json(full);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
