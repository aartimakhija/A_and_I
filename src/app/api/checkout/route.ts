import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { createRzpOrder } from "@/lib/razorpay";
import { getSession } from "@/lib/rbac";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const num = customAlphabet("0123456789", 5);
const rewardCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

const Body = z.object({
  email: z.string().email(),
  items: z.array(z.object({ productId: z.string(), size: z.string(), tier: z.string().optional(), qty: z.number().int().positive().default(1) })).min(1),
  ship: z.object({ name: z.string(), phone: z.string(), line1: z.string(), city: z.string(), state: z.string(), pincode: z.string() }).optional(),
  note: z.string().optional(),
  promoCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { ok } = rateLimit(`checkout:${clientIp(req)}`, 20, 10 * 60 * 1000); // 20 attempts / 10 min per IP
  if (!ok) return NextResponse.json({ error: "Too many checkout attempts — please wait a few minutes and try again." }, { status: 429 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { email, items, ship, note, promoCode } = parsed.data;
  const session = await getSession();

  // Re-price server-side (never trust client totals)
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    include: { tiers: true },
  });
  let subtotal = 0;
  const orderItems = items.map((i) => {
    const p = products.find((x) => x.id === i.productId);
    if (!p) throw new Error("Bad product");
    const tier = p.tiers.find((t) => t.label === i.tier);
    const unit = p.basePrice + (tier?.priceAdd ?? 0);
    subtotal += unit * i.qty;
    return { productId: p.id, vendorId: p.vendorId, name: p.name, size: i.size, tier: i.tier, unitPrice: unit, qty: i.qty };
  });
  const shipping = subtotal >= 500000 ? 0 : 9900; // free over ₹5,000

  // Apply a promo/referral code — validated and priced server-side, never trusting a client-computed discount.
  let discount = 0;
  let appliedCode: string | null = null;
  let promo = null as Awaited<ReturnType<typeof prisma.promoCode.findUnique>> | null;
  if (promoCode) {
    promo = await prisma.promoCode.findUnique({ where: { code: promoCode.trim().toUpperCase() } });
    if (promo && promo.active && promo.redemptions < promo.maxRedemptions) {
      discount = Math.round(subtotal * (promo.percentOff / 100));
      appliedCode = promo.code;
    }
  }
  const total = Math.max(0, subtotal + shipping - discount);

  const order = await prisma.order.create({
    data: {
      number: "AI-" + num(), email, userId: session.userId, subtotal, shipping, discount, discountCode: appliedCode, total, note,
      shipName: ship?.name, shipPhone: ship?.phone, shipLine1: ship?.line1, shipCity: ship?.city, shipState: ship?.state, shipPincode: ship?.pincode,
      items: { create: orderItems },
      payment: { create: { amount: total, status: "CREATED" } },
    },
    include: { payment: true },
  });

  // Redeem the code + reward the referrer (their "get 10%" side of the deal) —
  // done alongside order creation, before payment, since this is demand/usage
  // tracking rather than something that needs to wait for a successful charge.
  if (promo && appliedCode) {
    await prisma.promoCode.update({ where: { id: promo.id }, data: { redemptions: { increment: 1 } } });
    if (promo.source === "REFERRAL" && promo.referrerUserId && promo.referrerUserId !== session.userId) {
      await prisma.promoCode.create({
        data: {
          code: `THANKS-${rewardCode()}`, percentOff: 10, source: "REWARD",
          rewardForUserId: promo.referrerUserId, maxRedemptions: 1,
        },
      });
    }
  }

  let rzp;
  try {
    rzp = await createRzpOrder(total, order.number);
  } catch (e: any) {
    return NextResponse.json({ error: "Payments aren't configured yet — set RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET.", detail: e?.message }, { status: 503 });
  }
  await prisma.payment.update({ where: { orderId: order.id }, data: { rzpOrderId: rzp.id } });

  return NextResponse.json({
    orderId: order.id, number: order.number, amount: total, discount,
    razorpayOrderId: rzp.id, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
