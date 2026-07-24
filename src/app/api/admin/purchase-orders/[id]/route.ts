import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: params.id },
    include: { vendor: true, items: { orderBy: { position: "asc" }, include: { product: { select: { name: true } } } } },
  });
  if (!po) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(po);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const existing = await prisma.purchaseOrder.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const b = await req.json();
  const data: any = {};
  for (const f of ["notes", "terms", "status", "priority", "measurementNotes"]) if (b[f] !== undefined) data[f] = b[f];
  if (b.expectedDelivery !== undefined) data.expectedDelivery = b.expectedDelivery ? new Date(b.expectedDelivery) : null;
  if (Array.isArray(b.referenceImages)) data.referenceImages = b.referenceImages;

  const po = await prisma.purchaseOrder.update({ where: { id: params.id }, data });

  if (Array.isArray(b.items)) {
    await prisma.purchaseOrderItem.deleteMany({ where: { poId: po.id } });
    await prisma.purchaseOrderItem.createMany({
      data: b.items.map((it: any, i: number) => ({
        poId: po.id, productId: it.productId || null, description: it.description, size: it.size || null,
        qty: it.qty, unitCost: Math.round((it.unitCost || 0) * 100), position: i,
      })),
    });
  }

  const full = await prisma.purchaseOrder.findUnique({ where: { id: po.id }, include: { vendor: true, items: { orderBy: { position: "asc" } } } });
  return NextResponse.json(full);
}
