import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const data: any = {};
  for (const f of ["name", "sku", "unit", "stockQty", "reorderLevel", "vendorId"]) if (b[f] !== undefined) data[f] = b[f] || null;
  if (b.costPerUnit !== undefined) data.costPerUnit = Math.round(b.costPerUnit * 100);
  const material = await prisma.material.update({ where: { id: params.id }, data });
  return NextResponse.json(material);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const inUse = await prisma.productMaterial.count({ where: { materialId: params.id } });
  if (inUse > 0) {
    return NextResponse.json({ error: `${inUse} product(s) reference this material in their Bill of Materials — remove it from those first.` }, { status: 400 });
  }
  await prisma.material.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
