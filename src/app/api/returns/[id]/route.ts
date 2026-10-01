import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const creditCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

// Admin: move a return through APPROVED → PICKED_UP → RECEIVED → EXCHANGED or
// STORE_CREDIT_ISSUED, or REJECTED. A&I doesn't issue cash refunds for any
// reason (policy as of Oct 2026) — RECEIVED resolves to one of:
//   EXCHANGED            — a replacement unit/size has been shipped (tracked outside this flow)
//   STORE_CREDIT_ISSUED  — the requested size/piece wasn't available, so we mint a
//                          one-time, fixed-amount PromoCode worth the item's price instead
export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const ret = await prisma.return.findUnique({
    where: { id: params.id },
    include: { order: true, orderItem: true },
  });
  if (!ret) return NextResponse.json({ error: "not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (b.status) data.status = b.status;
  if (b.note !== undefined) data.note = b.note;

  if (b.status === "STORE_CREDIT_ISSUED") {
    const amount = ret.orderItem.unitPrice * ret.orderItem.qty; // paise — full value of the exchanged piece
    const code = `CREDIT-${creditCode()}`;
    await prisma.promoCode.create({
      data: { code, percentOff: 0, amountOff: amount, source: "EXCHANGE_CREDIT", maxRedemptions: 1 },
    });
    data.creditCode = code;
  }

  const updated = await prisma.return.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}
