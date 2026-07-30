import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const data: any = {};
  if (b.read !== undefined) data.read = !!b.read;
  const msg = await prisma.contactMessage.update({ where: { id: params.id }, data });
  return NextResponse.json(msg);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  await prisma.contactMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
