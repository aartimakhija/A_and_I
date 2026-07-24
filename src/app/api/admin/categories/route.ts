import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { getCategories } from "@/lib/categories";

export async function GET() {
  await requireRole(["ADMIN"]);
  const categories = await getCategories(true); // include inactive in admin view
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!b.name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const slug = (b.slug || b.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const maxPos = await prisma.category.aggregate({ _max: { position: true } });
  const category = await prisma.category.create({
    data: { name: b.name, slug, position: (maxPos._max.position ?? -1) + 1, active: b.active ?? true },
  });
  return NextResponse.json(category, { status: 201 });
}
