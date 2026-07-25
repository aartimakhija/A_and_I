import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET() {
  await requireRole(["ADMIN"]);
  const checks = await prisma.qualityCheck.findMany({
    include: { poItem: { include: { po: { select: { poNumber: true } }, product: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(checks);
}

// Journey 9: "If approved, Inventory increases. If rejected, Return to vendor."
// Passing qtyPassed units here bumps the matching Product+size Variant's
// stock immediately — the one automatic inventory movement in this flow,
// same principle as MaterialOrder receipt in Phase 1.
export async function POST(req: NextRequest) {
  const session = await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!b.poItemId || b.qtyChecked === undefined) return NextResponse.json({ error: "poItemId and qtyChecked required" }, { status: 400 });

  const poItem = await prisma.purchaseOrderItem.findUnique({ where: { id: b.poItemId } });
  if (!poItem) return NextResponse.json({ error: "production order item not found" }, { status: 404 });

  const qtyPassed = b.qtyPassed ?? 0;
  const qtyFailed = b.qtyFailed ?? 0;
  const result = qtyFailed === 0 ? "PASSED" : qtyPassed === 0 ? "FAILED" : "PARTIAL";

  const check = await prisma.qualityCheck.create({
    data: {
      poItemId: b.poItemId, checklist: b.checklist ?? {}, qtyChecked: b.qtyChecked,
      qtyPassed, qtyFailed, result, notes: b.notes || null, photos: b.photos || [],
      inspectedBy: session.userId ?? undefined,
    },
  });

  // Auto-increment finished-goods stock for whatever passed inspection.
  let stockUpdated = false;
  if (qtyPassed > 0 && poItem.productId && poItem.size) {
    const variant = await prisma.variant.findFirst({ where: { productId: poItem.productId, size: poItem.size } });
    if (variant) {
      await prisma.variant.update({ where: { id: variant.id }, data: { stock: { increment: qtyPassed } } });
      stockUpdated = true;
    }
  }

  return NextResponse.json({ ...check, stockUpdated }, { status: 201 });
}
