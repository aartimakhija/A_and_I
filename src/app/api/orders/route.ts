import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// OMS (admin): all orders
export async function GET() {
  await requireRole(["ADMIN"]);
  const orders = await prisma.order.findMany({ include: { items: true, payment: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(orders);
}
