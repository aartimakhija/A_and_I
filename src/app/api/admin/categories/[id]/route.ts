import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const data: any = {};
  for (const f of ["name", "slug", "position", "active"]) if (b[f] !== undefined) data[f] = b[f];
  const category = await prisma.category.update({ where: { id: params.id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category) return NextResponse.json({ error: "not found" }, { status: 404 });

  const inUse = await prisma.product.count({ where: { category: category.slug } });
  if (inUse > 0) {
    return NextResponse.json({ error: `${inUse} product(s) still use this category — reassign or archive them first, or just deactivate the category instead of deleting it.` }, { status: 400 });
  }
  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
