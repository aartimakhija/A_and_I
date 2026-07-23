import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaymentSignature } from "@/lib/razorpay";

// Called from the client right after Razorpay's checkout modal succeeds.
// This only unlocks the "thank you" screen faster — the webhook
// (/api/webhooks/razorpay) remains the source of truth for actually marking
// the order paid, decrementing stock, and minting garment passports, since
// only the webhook is guaranteed to fire even if the customer closes the tab.
export async function POST(req: NextRequest) {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const valid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!valid) return NextResponse.json({ error: "signature mismatch" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 });

  return NextResponse.json({ ok: true, number: order.number });
}
