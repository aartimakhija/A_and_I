import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  // Promo codes are short, guessable strings — without a limit here this endpoint
  // is a free oracle for brute-forcing/enumerating active discount codes.
  const { ok } = await rateLimit(`promo:${clientIp(req)}`, 15, 10 * 60 * 1000); // 15 lookups / 10 min per IP
  if (!ok) return NextResponse.json({ valid: false, error: "Too many attempts — please try again later." }, { status: 429 });

  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ valid: false });

  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.active || promo.redemptions >= promo.maxRedemptions) {
    return NextResponse.json({ valid: false });
  }
  return NextResponse.json({ valid: true, percentOff: promo.percentOff });
}
