import { NextRequest, NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/integrations";
import { requireRole } from "@/lib/rbac";

// SECURITY FIX: this previously had no auth check at all — anyone on the
// internet could POST here and make the server send arbitrary WhatsApp
// messages (via our business account) to any phone number with any
// template. Every actual caller in this codebase (the payment webhook) uses
// sendWhatsApp() directly as a function, not this HTTP route, so admin-only
// is the correct restriction — this is for manual/admin-triggered sends.
export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const { to, template, vars } = await req.json();
  if (!to || !template) return NextResponse.json({ error: "to and template required" }, { status: 400 });
  return NextResponse.json(await sendWhatsApp(to, template, vars));
}
