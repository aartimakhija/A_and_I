import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// Vendor portal: ONLY order items belonging to this vendor.
export async function GET() {
  const s = await requireRole(["VENDOR"]);
  const items = await prisma.orderItem.findMany({
    where: { vendorId: s.vendorId! },
    include: { order: { select: { number: true, status: true, createdAt: true, shipCity: true, shipState: true } } },
    orderBy: { id: "desc" }, take: 200,
  });
  return NextResponse.json(items);
}
