import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { StoreShell } from "@/components/storefront/StoreShell";
import { getSession } from "@/lib/rbac";

// Product/order data changes constantly and depends on a live database, so
// this whole route group should never be statically prerendered at build
// time — that's what was causing every storefront page to fail the build
// (Next tried to pre-render them before the database even had tables).
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [products, session] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" } }),
    getSession(),
  ]);
  const catalogue = products.map(toSFProduct);

  // Signed-in customers get their wishlist from the account, not the browser —
  // fetched here (server-side) so it's present on first paint, no extra round-trip.
  let initialSaved: string[] = [];
  if (session.userId) {
    const rows = await prisma.wishlist.findMany({ where: { userId: session.userId }, select: { productId: true } });
    initialSaved = rows.map((r) => r.productId);
  }

  return <StoreShell catalogue={catalogue} isLoggedIn={!!session.userId} initialSaved={initialSaved}>{children}</StoreShell>;
}
