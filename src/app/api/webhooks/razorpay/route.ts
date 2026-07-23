import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhook } from "@/lib/razorpay";
import { newSerial } from "@/lib/passport";
import { sendWhatsApp } from "@/lib/integrations";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";
  if (!verifyWebhook(raw, sig)) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  const event = JSON.parse(raw);
  // Idempotency
  const eid = event.id || event.payload?.payment?.entity?.id;
  const seen = await prisma.webhookEvent.findUnique({ where: { eventId: eid } }).catch(() => null);
  if (seen) return NextResponse.json({ ok: true, dedup: true });
  await prisma.webhookEvent.create({ data: { provider: "razorpay", eventId: eid, payload: event } });

  if (event.event === "payment.captured" || event.event === "order.paid") {
    const pe = event.payload.payment.entity;
    const payment = await prisma.payment.findFirst({ where: { rzpOrderId: pe.order_id }, include: { order: { include: { items: true } } } });
    if (payment) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "CAPTURED", rzpPaymentId: pe.id, method: pe.method } });
      await prisma.order.update({ where: { id: payment.orderId }, data: { status: "PAID" } });
      // decrement stock + mint garment passports
      for (const it of payment.order.items) {
        await prisma.variant.updateMany({ where: { productId: it.productId, size: it.size }, data: { stock: { decrement: it.qty } } });
        await prisma.inventoryLedger.create({ data: { variantId: it.id, delta: -it.qty, reason: "ORDER", refId: payment.orderId } });
        await prisma.passport.create({ data: { serial: newSerial(), orderItemId: it.id, designer: "A & I Atelier", materialOrigin: "India" } });
      }
      if (payment.order.shipPhone) await sendWhatsApp(payment.order.shipPhone, "order_confirmed", [payment.order.number]);
    }
  }
  return NextResponse.json({ ok: true });
}
