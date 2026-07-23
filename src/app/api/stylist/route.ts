import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { styleAdvice } from "@/lib/stylist";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
  const catalogue = await prisma.product.findMany({ where: { status: "ACTIVE" }, select: { name: true, category: true, colorName: true }, take: 60 });
  try {
    const text = await styleAdvice(prompt, catalogue);
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: "stylist unavailable", detail: e?.message }, { status: 503 });
  }
}
