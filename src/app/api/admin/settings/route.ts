import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  await requireRole(["ADMIN"]);
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

const FIELDS = [
  "siteName", "tagline", "description", "faviconUrl", "logoUrl", "ogImageUrl", "announcementText",
  "socialInstagram", "socialWhatsapp", "socialPinterest", "socialFacebook", "socialTwitter",
  "contactEmail", "contactPhone", "gaMeasurementId", "googleSiteVerification", "bingSiteVerification",
];

export async function PATCH(req: NextRequest) {
  await requireRole(["ADMIN"]);
  await getSiteSettings(); // ensure the row exists before updating
  const b = await req.json();
  const data: any = {};
  for (const f of FIELDS) if (b[f] !== undefined) data[f] = b[f] || null;

  const updated = await prisma.siteSettings.update({ where: { id: "singleton" }, data });
  return NextResponse.json(updated);
}
