import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { StoreShell } from "@/components/storefront/StoreShell";
import { getSession } from "@/lib/rbac";
import { getSiteSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";

// This layout runs on every single storefront page, so an uncached full-table
// scan here (with images/variants/tiers joined in for ~80+ products) was the
// single heaviest, most repeated query on the site — hit fresh on every nav,
// on top of whatever that page's own route already queries. Caching it for a
// minute means only one real DB round-trip per minute across all traffic,
// not one per page view; product/stock edits in admin show up within 60s.
const getCachedCatalogue = unstable_cache(
  async () => {
    const products = await prisma.product.findMany({ where: { status: "ACTIVE" }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" } });
    return products.map(toSFProduct);
  },
  ["storefront-layout-catalogue"],
  { revalidate: 60, tags: ["products"] }
);
const getCachedCategories = unstable_cache(() => getCategories(), ["storefront-layout-categories"], { revalidate: 300, tags: ["categories"] });

// Product/order data changes constantly and depends on a live database, so
// this whole route group should never be statically prerendered at build
// time — that's what was causing every storefront page to fail the build
// (Next tried to pre-render them before the database even had tables).
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  // Every call here is individually guarded: a transient DB hiccup (Neon
  // waking from idle, a brief connection blip) should degrade the page —
  // empty catalogue, logged-out state — never take down the whole site with
  // Next's generic crash screen. Real, sustained DB outages still surface
  // via the root error.tsx boundary on whichever page actually needs data
  // that truly failed to load (e.g. a product/category page with no cache
  // to fall back on).
  const [catalogue, session, settings, categories] = await Promise.all([
    getCachedCatalogue().catch(() => []),
    getSession().catch(() => ({} as Awaited<ReturnType<typeof getSession>>)),
    getSiteSettings(),
    getCachedCategories().catch(() => []),
  ]);

  // Signed-in customers get their wishlist from the account, not the browser —
  // fetched here (server-side) so it's present on first paint, no extra round-trip.
  let initialSaved: string[] = [];
  if (session.userId) {
    initialSaved = await prisma.wishlist.findMany({ where: { userId: session.userId }, select: { productId: true } })
      .then((rows) => rows.map((r) => r.productId))
      .catch(() => []);
  }

  const siteSettings = {
    announcementText: settings.announcementText, nextDropAt: settings.nextDropAt?.toISOString() ?? null,
    socialInstagram: settings.socialInstagram,
    socialWhatsapp: settings.socialWhatsapp, socialPinterest: settings.socialPinterest,
    socialFacebook: settings.socialFacebook, socialTwitter: settings.socialTwitter,
    contactEmail: settings.contactEmail, contactPhone: settings.contactPhone, logoUrl: settings.logoUrl, footerImageUrl: settings.footerImageUrl,
  };

  return (
    <StoreShell catalogue={catalogue} categories={categories} isLoggedIn={!!session.userId} initialSaved={initialSaved} siteSettings={siteSettings}>
      {children}
    </StoreShell>
  );
}
