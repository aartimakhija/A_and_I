import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const Body = z.object({
  email: z.string().email(),
  source: z.string().max(40).optional(),
});

export async function POST(req: NextRequest) {
  const { ok } = await rateLimit(`newsletter:${clientIp(req)}`, 5, 10 * 60 * 1000); // 5 signups / 10 min per IP
  if (!ok) return NextResponse.json({ error: "Too many attempts — please try again in a few minutes." }, { status: 429 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  // Upsert so re-submitting the same email (e.g. from two forms on one page) never errors.
  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email, source: parsed.data.source },
  });
  return NextResponse.json({ ok: true });
}
