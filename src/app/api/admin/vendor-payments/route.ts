import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!b.vendorId || !b.amount) return NextResponse.json({ error: "vendorId and amount required" }, { status: 400 });

  const payment = await prisma.vendorPayment.create({
    data: {
      vendorId: b.vendorId, poId: b.poId || null, amount: Math.round(b.amount * 100),
      method: b.method || null, reference: b.reference || null, notes: b.notes || null, status: "PAID",
    },
  });
  return NextResponse.json(payment, { status: 201 });
}
