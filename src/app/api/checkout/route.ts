import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createRzpOrder } from "@/lib/razorpay";
import { getSession } from "@/lib/rbac";
import { customAlphabet } from "nanoid";
const num = customAlphabet("0123456789", 5);

const Body = z.object({
  email: z.string().email(),
  items: z.array(z.object({ productId: z.string(), size: z.string(), tier: z.string().optional(), qty: z.number().int().positive().default(1) })).min(1),
  ship: z.object({ name: z.string(), phone: z.string(), line1: z.string(), city: z.string(), state: z.string(), pincode: z.string() }).optional(),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { email, items, ship, note } = parsed.data;
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
  const total = subtotal + shipping;

  const order = await prisma.order.create({
    data: {
      number: "AI-" + num(), email, userId: session.userId, subtotal, shipping, total, note,
      shipName: ship?.name, shipPhone: ship?.phone, shipLine1: ship?.line1, shipCity: ship?.city, shipState: ship?.state, shipPincode: ship?.pincode,
      items: { create: orderItems },
      payment: { create: { amount: total, status: "CREATED" } },
    },
    include: { payment: true },
  });

  const rzp = await createRzpOrder(total, order.number);
  await prisma.payment.update({ where: { orderId: order.id }, data: { rzpOrderId: rzp.id } });

  return NextResponse.json({
    orderId: order.id, number: order.number, amount: total,
    razorpayOrderId: rzp.id, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
