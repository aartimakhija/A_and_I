import { prisma } from "@/lib/prisma";
import { productJsonLd, pageMetadata, breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Product } from "@/components/storefront/Product";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { getSiteSettings } from "@/lib/settings";
import { getSession } from "@/lib/rbac";
import { notFound } from "next/navigation";

const CAT_LABEL: Record<string, string> = { ready: "Ready-to-Wear", craft: "Indian Craft", linen: "Linen" };

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const p = await prisma.product.findUnique({ where: { slug: params.slug }, include: { images: true } });
  if (!p) return {};
  if (p.status === "DRAFT" || p.status === "ARCHIVED") {
    const session = await getSession();
    if (session.role !== "ADMIN") return {};
  }
  return pageMetadata({
    title: p.metaTitle || p.name,
    description: p.metaDesc || p.story || `${p.name} — Indian craft, global silhouette. Handmade in small runs across India.`,
    path: `/products/${p.slug}`,
    image: p.images[0]?.url,
  });
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const [p, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: params.slug },
      include: { ...PRODUCT_INCLUDE, vendor: { select: { moq: true, leadTimeDays: true } } },
    }),
    getSiteSettings(),
  ]);
  if (!p) notFound();

  // Real reservation progress against the vendor's actual minimum production
  // run (Vendor.moq) and a bounded lead time (Vendor.leadTimeDays) — both
  // already tracked in the DB but never surfaced on the PDP, so "we only go
  // into production once enough of you commit" had no visible evidence
  // behind it. CANCELLED reservations don't count toward the total.
  const reservedCount = p.preOrder
    ? await prisma.preOrder.count({ where: { productId: p.id, status: { not: "CANCELLED" } } })
    : 0;

  // DRAFT and ARCHIVED products aren't public yet/anymore (SOLD_OUT still
  // is — it's just out of stock, not hidden). A signed-in admin can still
  // open the page to preview it before publishing; everyone else,
  // including anyone who has or guesses the direct URL, gets a normal 404.
  if (p.status === "DRAFT" || p.status === "ARCHIVED") {
    const session = await getSession();
    if (session.role !== "ADMIN") notFound();
  }

  const relatedRaw = await prisma.product.findMany({
    where: { category: p.category, status: "ACTIVE", id: { not: p.id } },
    include: PRODUCT_INCLUDE,
    take: 4,
  });
  const pairedRaw = p.pairWith.length
    ? await prisma.product.findMany({
        where: { slug: { in: p.pairWith }, status: "ACTIVE" },
        include: PRODUCT_INCLUDE,
      })
    : [];

  const product = toSFProduct(p);
  const related = relatedRaw.map(toSFProduct);
  const paired = pairedRaw.map(toSFProduct);
  const catLabel = CAT_LABEL[p.category] ?? p.category;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(productJsonLd(p)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, { name: catLabel, path: `/shop/${p.category}` }, { name: p.name, path: `/products/${p.slug}` }])
      ) }} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Collection", path: "/shop/all" }, { name: catLabel, path: `/shop/${p.category}` }, { name: p.name, path: `/products/${p.slug}` }]} />
      <Product
        product={product} related={related} paired={paired} defaultDeliveryNotes={settings.defaultDeliveryNotes}
        reservation={p.preOrder ? { count: reservedCount, moq: p.vendor.moq, leadTimeDays: p.vendor.leadTimeDays } : undefined}
      />
    </>
  );
}
