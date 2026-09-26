import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { styleMatch } from "@/lib/stylist-static";
import { rateLimit, clientIp } from "@/lib/rate-limit";

// Static rule-based stylist — no LLM, no API key, no network round-trip.
// Trades free-text understanding for instant, zero-cost, unbreakable results.
// Public and unauthenticated, and it runs a DB query every call — the one
// public, DB-hitting route on the site that had no rate limit (contact,
// newsletter, checkout, preorders, returns and promo/validate all do).
export async function POST(req: NextRequest) {
  const { ok } = rateLimit(`stylist:${clientIp(req)}`, 30, 10 * 60 * 1000); // 30 requests / 10 min per IP
  if (!ok) return NextResponse.json({ error: "Too many requests — try again in a few minutes." }, { status: 429 });

  const { occasion, vibe } = await req.json();
  if (!occasion || !vibe) return NextResponse.json({ error: "occasion and vibe required" }, { status: 400 });

  const catalogue = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, slug: true, name: true, category: true, colorHex: true, story: true },
    take: 100,
  });
  const result = styleMatch(occasion, vibe, catalogue);
  return NextResponse.json(result);
}
