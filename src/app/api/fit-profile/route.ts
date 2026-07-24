import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { recommendSize } from "@/lib/fit";

const Body = z.object({
  heightCm: z.number(), weightKg: z.number(),
  usualSize: z.enum(["XS", "S", "M", "L", "XL"]),
  fitPreference: z.enum(["loose", "true-to-size", "fitted"]),
});

// Guests still get a recommendation client-side (see src/lib/fit.ts) — this
// route only persists it for signed-in customers, so their size follows them
// across devices and feeds the AI stylist next time they ask.
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const session = await getSession();
  if (!session.userId) return NextResponse.json({ ok: true, saved: false }); // guest — nothing to persist

  const rec = recommendSize(parsed.data);
  await prisma.user.update({
    where: { id: session.userId },
    data: { savedSize: rec.size, stylePrefs: parsed.data },
  });
  return NextResponse.json({ ok: true, saved: true, recommendedSize: rec.size });
}
