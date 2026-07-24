import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ valid: false });

  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.active || promo.redemptions >= promo.maxRedemptions) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({ valid: true, percentOff: promo.percentOff });
}
