import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { refundPayment } from "@/lib/razorpay";

// Admin: move a return through APPROVED → PICKED_UP → RECEIVED → REFUNDED, or REJECTED.
// Issuing REFUNDED (with an amount) actually calls Razorpay to refund the payment.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const ret = await prisma.return.findUnique({
    where: { id: params.id },
    include: { order: { include: { payment: true } }, orderItem: true },
  });
  if (!ret) return NextResponse.json({ error: "not found" }, { status: 404 });

  const data: any = {};
  if (b.status) data.status = b.status;
  if (b.note !== undefined) data.note = b.note;

  if (b.status === "REFUNDED") {
    const amount = b.refundAmount ?? ret.orderItem.unitPrice * ret.orderItem.qty;
    data.refundAmount = amount;
    data.refundedAt = new Date();
    if (ret.order.payment?.rzpPaymentId) {
      try {
        const refund = await refundPayment(ret.order.payment.rzpPaymentId, amount);
        data.rzpRefundId = (refund as any).id;
      } catch (e: any) {
        return NextResponse.json({ error: "refund failed", detail: e?.message }, { status: 502 });
      }
    }
  }

  const updated = await prisma.return.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}
