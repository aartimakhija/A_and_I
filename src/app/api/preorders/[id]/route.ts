import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireRole(["ADMIN"]);
  const b = await req.json();
  if (!["PENDING", "CONTACTED", "CONFIRMED", "FULFILLED", "CANCELLED"].includes(b.status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }
  const pre = await prisma.preOrder.update({ where: { id: params.id }, data: { status: b.status } });
  return NextResponse.json(pre);
}
