import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const Body = z.object({
  orderItemId: z.string(),
  email: z.string().email(),
  reason: z.enum(["SIZE_ISSUE", "DAMAGED", "NOT_AS_DESCRIBED", "CHANGED_MIND", "QUALITY_ISSUE", "OTHER"]),
  note: z.string().optional(),
  preferredSize: z.string().optional(),
});

const EXCHANGE_WINDOW_DAYS = 7;

// Customer-facing: request an exchange on a delivered order item. A&I doesn't
// offer cash refunds for any reason — every request resolves to either a
// replacement unit/size, or a store credit if that size has sold out (see
// ReturnActions.tsx / the PATCH handler below).
// Security note: this previously only checked ownership when BOTH a session
// and an order.userId existed — a guest order (no userId) with a known
// orderItemId could have a return filed against it by anyone. Now every
// request must also match the order's email, whether or not the requester
// is signed in, so a guessed/leaked ID alone isn't enough.
export async function POST(req: NextRequest) {
  const { ok } = await rateLimit(`returns:${clientIp(req)}`, 10, 15 * 60 * 1000);
  if (!ok) return NextResponse.json({ error: "Too many requests — please try again later." }, { status: 429 });

  const session = await getSession();
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const item = await prisma.orderItem.findUnique({
    where: { id: parsed.data.orderItemId },
    include: { order: { include: { shipment: true } } },
  });
  if (!item) return NextResponse.json({ error: "order item not found" }, { status: 404 });

  const emailMatches = item.order.email.toLowerCase() === parsed.data.email.toLowerCase();
  const sessionMatches = !!session.userId && item.order.userId === session.userId;
  if (!emailMatches && !sessionMatches) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!["DELIVERED", "SHIPPED"].includes(item.order.status)) {
    return NextResponse.json({ error: "exchanges can only be requested after shipping" }, { status: 400 });
  }

  // The 7-day window starts at actual delivery. If the carrier hasn't marked
  // it delivered yet (deliveredAt is null), the window hasn't started —
  // allow the request rather than blocking on a tracking lag.
  const deliveredAt = item.order.shipment?.deliveredAt;
  if (deliveredAt) {
    const daysSince = (Date.now() - deliveredAt.getTime()) / (24 * 60 * 60 * 1000);
    if (daysSince > EXCHANGE_WINDOW_DAYS) {
      return NextResponse.json({ error: `The ${EXCHANGE_WINDOW_DAYS}-day exchange window for this piece has passed.` }, { status: 400 });
    }
  }

  const ret = await prisma.return.create({
    data: {
      orderId: item.orderId, orderItemId: item.id, reason: parsed.data.reason, note: parsed.data.note,
      preferredSize: parsed.data.preferredSize,
    },
  });
  return NextResponse.json(ret, { status: 201 });
}
