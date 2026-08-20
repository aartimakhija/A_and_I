import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { Bespoke } from "@/components/storefront/Bespoke";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bespoke",
  description: "Made-to-measure commissions from A&I's Jaipur and Kutch ateliers — your exact measurements, your choice of fabric and finish.",
  path: "/bespoke",
});

export default async function BespokePage() {
  const pieces = await prisma.product.findMany({
    where: { status: "ACTIVE", category: "craft" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Bespoke", path: "/bespoke" }])
      ) }} />
      <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Bespoke", path: "/bespoke" }]} />
      <Bespoke pieces={pieces.map(toSFProduct)} />
    </>
  );
}
