import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const num = customAlphabet("0123456789", 5);

export async function GET() {
  await requireRole(["ADMIN"]);
  const pos = await prisma.purchaseOrder.findMany({
    include: { vendor: { select: { name: true } }, items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pos);
}

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!b.vendorId) return NextResponse.json({ error: "vendorId required" }, { status: 400 });
  if (!Array.isArray(b.items) || b.items.length === 0) return NextResponse.json({ error: "at least one line item required" }, { status: 400 });

  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber: `PO-${num()}`, vendorId: b.vendorId, notes: b.notes || null, terms: b.terms || null,
      status: b.status || "DRAFT",
      items: {
        create: b.items.map((it: any, i: number) => ({
          productId: it.productId || null, description: it.description, qty: it.qty,
          unitCost: Math.round((it.unitCost || 0) * 100), position: i,
        })),
      },
    },
  });
  return NextResponse.json(po, { status: 201 });
}
