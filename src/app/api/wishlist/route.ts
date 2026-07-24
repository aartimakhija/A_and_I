import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";

export async function GET() {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ productIds: [] });
  const rows = await prisma.wishlist.findMany({ where: { userId: session.userId }, select: { productId: true } });
  return NextResponse.json({ productIds: rows.map((r) => r.productId) });
}

// Toggle a product in the signed-in user's wishlist. Guests get a 401 —
// the client falls back to localStorage-only for them (see StoreContext).
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "sign in required" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const existing = await prisma.wishlist.findUnique({ where: { userId_productId: { userId: session.userId, productId } } });
  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }
  await prisma.wishlist.create({ data: { userId: session.userId, productId } });
  return NextResponse.json({ saved: true });
}
