import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, vendorScope } from "@/lib/rbac";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const s = await requireRole(["ADMIN", "VENDOR"]);
  const p = await prisma.product.findFirst({
    where: { id: params.id, ...vendorScope(s) },
    include: { images: true, variants: true, tiers: true, bom: true },
  });
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(p);
}

// Edit an existing product — the CMS "edit product" form's endpoint.
// Vendors can only edit their own products; vendorScope() enforces that at read time,
// and we re-check ownership explicitly before writing.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const s = await requireRole(["ADMIN", "VENDOR"]);
  const existing = await prisma.product.findFirst({ where: { id: params.id, ...vendorScope(s) } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const b = await req.json();
  const data: any = {};
  for (const f of ["name", "story", "category", "colorHex", "colorName", "fabric", "basePrice", "status", "metaTitle", "metaDesc", "featured", "featuredOrder", "lookbookOrder", "preOrder"]) {
    if (b[f] !== undefined) data[f] = b[f];
  }
  if (Array.isArray(b.occasion)) data.occasion = b.occasion;

  const p = await prisma.product.update({ where: { id: params.id }, data });

  // Replace variants (sizes/stock) wholesale if provided — simplest correct approach for a small catalogue.
  if (Array.isArray(b.variants)) {
    await prisma.variant.deleteMany({ where: { productId: p.id } });
    await prisma.variant.createMany({
      data: b.variants.map((v: any) => ({ productId: p.id, size: v.size, sku: v.sku || `${p.slug}-${v.size}`, stock: v.stock ?? 0 })),
    });
  }
  // Replace fabric tiers wholesale if provided
  if (Array.isArray(b.tiers)) {
    await prisma.fabricTier.deleteMany({ where: { productId: p.id } });
    await prisma.fabricTier.createMany({
      data: b.tiers.map((t: any, i: number) => ({ productId: p.id, label: t.label, priceAdd: t.priceAdd ?? 0, position: t.position ?? i })),
    });
  }
  // Replace image list wholesale if provided — URLs come from /api/admin/upload
  if (Array.isArray(b.images)) {
    await prisma.productImage.deleteMany({ where: { productId: p.id } });
    await prisma.productImage.createMany({
      data: b.images.map((url: string, i: number) => ({ productId: p.id, url, position: i })),
    });
  }
  // Replace Bill of Materials wholesale if provided
  if (Array.isArray(b.bom)) {
    await prisma.productMaterial.deleteMany({ where: { productId: p.id } });
    const rows = b.bom.filter((r: any) => r.materialId);
    if (rows.length > 0) {
      await prisma.productMaterial.createMany({
        data: rows.map((r: any) => ({ productId: p.id, materialId: r.materialId, qtyPerUnit: r.qtyPerUnit ?? 1 })),
      });
    }
  }

  const full = await prisma.product.findUnique({ where: { id: p.id }, include: { images: true, variants: true, tiers: true, bom: true } });
  return NextResponse.json(full);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const s = await requireRole(["ADMIN", "VENDOR"]);
  const existing = await prisma.product.findFirst({ where: { id: params.id, ...vendorScope(s) } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  // Soft delete — archive rather than hard-delete, so historical orders keep a valid product reference.
  await prisma.product.update({ where: { id: params.id }, data: { status: "ARCHIVED" } });
  return NextResponse.json({ ok: true });
}
