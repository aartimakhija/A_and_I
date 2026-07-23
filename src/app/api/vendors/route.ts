import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

// Vendor management (admin only)
export async function GET() {
  await requireRole(["ADMIN"]);
  return NextResponse.json(await prisma.vendor.findMany({ include: { _count: { select: { products: true } } } }));
}
export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const v = await prisma.vendor.create({ data: { name: b.name, slug: b.slug, email: b.email, phone: b.phone, status: "APPROVED", commission: b.commission ?? 0.15, moq: b.moq ?? 1 } });
  return NextResponse.json(v, { status: 201 });
}
