import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const num = customAlphabet("0123456789", 5);

export async function GET() {
  await requireRole(["ADMIN"]);
  const orders = await prisma.materialOrder.findMany({
    include: { vendor: { select: { name: true } }, items: { include: { material: { select: { name: true, unit: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!Array.isArray(b.items) || b.items.length === 0) return NextResponse.json({ error: "at least one line item required" }, { status: 400 });

  const order = await prisma.materialOrder.create({
    data: {
      orderNumber: `MO-${num()}`, vendorId: b.vendorId || null, supplierName: b.supplierName || null,
      expectedDate: b.expectedDate ? new Date(b.expectedDate) : null, notes: b.notes || null, status: b.status || "DRAFT",
      items: {
        create: b.items.map((it: any, i: number) => ({
          materialId: it.materialId, qty: it.qty, rate: Math.round((it.rate || 0) * 100), position: i,
        })),
      },
    },
  });
  return NextResponse.json(order, { status: 201 });
}
