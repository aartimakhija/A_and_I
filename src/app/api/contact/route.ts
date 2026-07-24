import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const Body = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  topic: z.enum(["general", "wholesale", "press", "vendor"]).default("general"),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { ok } = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60 * 1000); // 5 messages / 10 min per IP
  if (!ok) return NextResponse.json({ error: "Too many messages — please try again in a few minutes." }, { status: 429 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const msg = await prisma.contactMessage.create({ data: parsed.data });
  // TODO: wire a real transactional email service (Resend/SendGrid/SES) here to
  // notify the team inbox and send the sender a confirmation — intentionally
  // stubbed like the other integrations until those credentials exist.
  return NextResponse.json({ ok: true, id: msg.id });
}
