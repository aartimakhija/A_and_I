import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// A vendor can move their own Production Order forward through the steps
// they actually control. SENT is set by admin (that's the "we've sent you
// the order" moment); COMPLETED requires QC to have passed, so it stays
// admin-only. Nothing here lets a vendor jump ahead, go backward, or touch
// an order that isn't theirs.
const VENDOR_TRANSITIONS: Record<string, string> = {
  SENT: "ACCEPTED",
  ACCEPTED: "IN_PROGRESS",
  IN_PROGRESS: "READY_FOR_PICKUP",
};

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const s = await requireRole(["VENDOR"]);
  const po = await prisma.purchaseOrder.findUnique({ where: { id: params.id } });
  if (!po || po.vendorId !== s.vendorId) return NextResponse.json({ error: "not found" }, { status: 404 });

  const next = VENDOR_TRANSITIONS[po.status];
  if (!next) {
    return NextResponse.json({ error: `Can't advance from ${po.status.replaceAll("_", " ")} — this step needs the studio's side.` }, { status: 400 });
  }

  const updated = await prisma.purchaseOrder.update({ where: { id: po.id }, data: { status: next } });
  return NextResponse.json(updated);
}
