import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const code = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

const Body = z.object({
  productId: z.string(),
  size: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  qty: z.number().int().positive().default(1),
});

// Customer-facing: reserve a pre-order piece. No payment is taken here —
// this is purely demand validation ("does this earn production?"), with a
// small discount code as the incentive to commit early, per the drop-system
// playbook: confirm quantity before a single unit is cut.
export async function POST(req: NextRequest) {
  const { ok } = rateLimit(`preorder:${clientIp(req)}`, 15, 10 * 60 * 1000);
  if (!ok) return NextResponse.json({ error: "Too many requests — please try again later." }, { status: 429 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return NextResponse.json({ error: "product not found" }, { status: 404 });
  if (!product.preOrder) return NextResponse.json({ error: "this product isn't open for pre-order" }, { status: 400 });

  const discountCode = `EARLY-${code()}`;
  const pre = await prisma.preOrder.create({
    data: { ...parsed.data, discountCode },
  });
  return NextResponse.json({ id: pre.id, discountCode }, { status: 201 });
}
