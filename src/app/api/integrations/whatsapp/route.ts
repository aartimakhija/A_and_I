import { NextRequest, NextResponse } from "next/server";
import { sendWhatsApp } from "@/lib/integrations";
export async function POST(req: NextRequest) {
  const { to, template, vars } = await req.json();
  return NextResponse.json(await sendWhatsApp(to, template, vars));
}
