import { auth } from "@/lib/auth";

export type SessionInfo = { userId?: string; role?: string; vendorId?: string | null };

export async function getSession(): Promise<SessionInfo> {
  const s: any = await auth();
  if (!s) return {};
  return { userId: s.user?.id, role: s.role, vendorId: s.vendorId };
}

export async function requireRole(roles: string[]): Promise<SessionInfo> {
  const s = await getSession();
  if (!s.role || !roles.includes(s.role)) throw new Response("Forbidden", { status: 403 });
  return s;
}

/** Returns a Prisma `where` clause that scopes a vendor to ONLY their data.
 *  Admins get an empty filter (everything); vendors are locked to vendorId. */
export function vendorScope(s: SessionInfo, field = "vendorId") {
  if (s.role === "ADMIN") return {};
  if (s.role === "VENDOR" && s.vendorId) return { [field]: s.vendorId };
  return { [field]: "__none__" }; // deny by default
}
