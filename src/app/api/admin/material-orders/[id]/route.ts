import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const order = await prisma.materialOrder.findUnique({
    where: { id: params.id },
    include: { vendor: true, items: { orderBy: { position: "asc" }, include: { material: true } } },
  });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(order);
}

// Journey 6: "Once received, Raw Material Inventory increases automatically."
// This is the one place that happens — moving status to RECEIVED bumps every
// line item's material stockQty by its ordered qty, exactly once (guarded by
// only allowing the transition from a non-RECEIVED status).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const existing = await prisma.materialOrder.findUnique({ where: { id: params.id }, include: { items: true } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const b = await req.json();
  const data: any = {};
  for (const f of ["notes", "supplierName", "vendorId", "expectedDate"]) if (b[f] !== undefined) data[f] = b[f] || null;
  if (b.status !== undefined) data.status = b.status;

  const becomingReceived = b.status === "RECEIVED" && existing.status !== "RECEIVED";

  if (becomingReceived) {
    await prisma.$transaction([
      prisma.materialOrder.update({ where: { id: existing.id }, data }),
      ...existing.items.map((it) =>
        prisma.material.update({ where: { id: it.materialId }, data: { stockQty: { increment: it.qty } } })
      ),
    ]);
  } else {
    await prisma.materialOrder.update({ where: { id: existing.id }, data });
  }

  const updated = await prisma.materialOrder.findUnique({ where: { id: existing.id }, include: { vendor: true, items: { include: { material: true } } } });
  return NextResponse.json(updated);
}
