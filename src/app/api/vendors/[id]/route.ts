import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const data: any = {};
  if (b.status) data.status = b.status; // PENDING | APPROVED | SUSPENDED
  if (b.commission !== undefined) data.commission = b.commission;
  if (b.moq !== undefined) data.moq = b.moq;
  const v = await prisma.vendor.update({ where: { id: params.id }, data });
  return NextResponse.json(v);
}
