import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { styleMatch } from "@/lib/stylist-static";

// Static rule-based stylist — no LLM, no API key, no network round-trip.
// Trades free-text understanding for instant, zero-cost, unbreakable results.
export async function POST(req: NextRequest) {
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
