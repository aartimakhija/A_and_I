import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Back-in-stock waitlist capture
export async function POST(req: NextRequest) {
  const { productId, email, size } = await req.json();
  if (!productId || !email) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  await prisma.notifyRequest.upsert({
    where: { productId_email_size: { productId, email, size: size ?? "" } },
    create: { productId, email, size },
    update: {},
  });
  return NextResponse.json({ ok: true });
}
