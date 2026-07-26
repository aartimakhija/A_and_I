import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, vendorScope } from "@/lib/rbac";

// CMS: list (admin = all, vendor = own) / create
export async function GET() {
  const s = await requireRole(["ADMIN", "VENDOR"]);
  const products = await prisma.product.findMany({ where: vendorScope(s), include: { images: true, variants: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const s = await requireRole(["ADMIN", "VENDOR"]);
  const b = await req.json();
  const vendorId = s.role === "ADMIN" ? b.vendorId : s.vendorId; // vendor can only create for self
  if (!vendorId) return NextResponse.json({ error: "vendorId required" }, { status: 400 });
  const p = await prisma.product.create({
    data: {
      slug: b.slug, name: b.name, story: b.story, category: b.category, colorHex: b.colorHex,
      colorName: b.colorName, basePrice: b.basePrice, discountPercent: b.discountPercent ?? null, costPrice: b.costPrice ?? null, vendorCost: b.vendorCost ?? null, status: b.status || "ACTIVE", vendorId,
      featured: b.featured ?? false, featuredOrder: b.featuredOrder ?? 0, lookbookOrder: b.lookbookOrder ?? null,
      preOrder: b.preOrder ?? false,
      variants: { create: (b.variants ?? []).map((v: any) => ({ size: v.size, sku: `${b.slug}-${v.size}`, stock: v.stock ?? 0 })) },
      tiers: { create: (b.tiers ?? []).map((t: any, i: number) => ({ label: t.label, priceAdd: t.priceAdd ?? 0, position: t.position ?? i })) },
      images: { create: (b.images ?? []).map((url: string, i: number) => ({ url, position: i })) },
      bom: { create: (b.bom ?? []).filter((r: any) => r.materialId).map((r: any) => ({ materialId: r.materialId, qtyPerUnit: r.qtyPerUnit ?? 1 })) },
    },
    include: { images: true, variants: true, tiers: true },
  });
  return NextResponse.json(p, { status: 201 });
}
