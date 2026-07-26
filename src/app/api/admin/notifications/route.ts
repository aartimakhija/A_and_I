import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { getNotifications } from "@/lib/notifications";

export async function GET() {
  await requireRole(["ADMIN"]);
  const notifications = await getNotifications();
  return NextResponse.json({ notifications });
}
