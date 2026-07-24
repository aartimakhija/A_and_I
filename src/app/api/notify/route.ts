import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const Body = z.object({ productId: z.string(), email: z.string().email(), size: z.string().optional() });

// Back-in-stock waitlist capture
export async function POST(req: NextRequest) {
  const { ok } = rateLimit(`notify:${clientIp(req)}`, 20, 10 * 60 * 1000);
  if (!ok) return NextResponse.json({ error: "Too many requests — please try again later." }, { status: 429 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "missing or invalid fields" }, { status: 400 });
  const { productId, email, size } = parsed.data;

  await prisma.notifyRequest.upsert({
    where: { productId_email_size: { productId, email, size: size ?? "" } },
    create: { productId, email, size },
    update: {},
  });
  return NextResponse.json({ ok: true });
}
