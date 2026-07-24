import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  await requireRole(["ADMIN"]);
  const materials = await prisma.material.findMany({ include: { vendor: { select: { name: true } } }, orderBy: { name: "asc" } });
  return NextResponse.json(materials);
}

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!b.name || !b.sku) return NextResponse.json({ error: "name and sku required" }, { status: 400 });
  const material = await prisma.material.create({
    data: {
      name: b.name, sku: b.sku, unit: b.unit || "meters",
      costPerUnit: Math.round((b.costPerUnit || 0) * 100),
      stockQty: b.stockQty || 0, reorderLevel: b.reorderLevel || 0,
      vendorId: b.vendorId || null,
    },
  });
  return NextResponse.json(material, { status: 201 });
}
