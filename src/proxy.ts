import { auth } from "@/lib/auth";

// Route-level RBAC. Vendor portal is isolated to VENDOR role; admin to ADMIN.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth as any)?.role;
  const isAuthed = !!req.auth;

  const needsAdmin = pathname.startsWith("/admin");
  const needsVendor = pathname.startsWith("/vendor");
  const needsAccount = pathname.startsWith("/account");

  if ((needsAdmin || needsVendor || needsAccount) && !isAuthed) {
    return Response.redirect(new URL(`/login?next=${pathname}`, req.nextUrl));
  }
  if (needsAdmin && role !== "ADMIN") return Response.redirect(new URL("/", req.nextUrl));
  if (needsVendor && role !== "VENDOR") return Response.redirect(new URL("/", req.nextUrl));
});

export const config = { matcher: ["/admin/:path*", "/vendor/:path*", "/account/:path*"] };
