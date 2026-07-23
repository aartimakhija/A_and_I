import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, requireRole } from "@/lib/rbac";

const Body = z.object({
  orderItemId: z.string(),
  reason: z.enum(["SIZE_ISSUE", "DAMAGED", "NOT_AS_DESCRIBED", "CHANGED_MIND", "QUALITY_ISSUE", "OTHER"]),
  note: z.string().optional(),
});

// Customer-facing: request a return/refund on a delivered order item.
export async function POST(req: NextRequest) {
  const session = await getSession();
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const item = await prisma.orderItem.findUnique({ where: { id: parsed.data.orderItemId }, include: { order: true } });
  if (!item) return NextResponse.json({ error: "order item not found" }, { status: 404 });
  if (session.userId && item.order.userId && item.order.userId !== session.userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!["DELIVERED", "SHIPPED"].includes(item.order.status)) {
    return NextResponse.json({ error: "returns can only be requested after shipping" }, { status: 400 });
  }

  const ret = await prisma.return.create({
    data: { orderId: item.orderId, orderItemId: item.id, reason: parsed.data.reason, note: parsed.data.note },
  });
  return NextResponse.json(ret, { status: 201 });
}

// Admin: list all return/refund requests (Returns queue).
export async function GET() {
  await requireRole(["ADMIN"]);
  const returns = await prisma.return.findMany({
    include: { order: { select: { number: true, email: true } }, orderItem: { select: { name: true, size: true, unitPrice: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(returns);
}
