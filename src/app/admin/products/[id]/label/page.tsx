import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";
import { urlQR } from "@/lib/passport";
import { LabelPrintView } from "@/components/admin/LabelPrintView";

export default async function ProductLabel({ params }: { params: { id: string } }) {
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    getSiteSettings(),
  ]);
  if (!product) notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products/${product.slug}`;
  const qrDataUrl = await urlQR(url);

  const price = product.basePrice / 100;
  const discountPercent = product.discountPercent && product.discountPercent > 0 && product.discountPercent < 100 ? product.discountPercent : null;
  const mrp = discountPercent ? Math.round(price / (1 - discountPercent / 100)) : null;

  return (
    <LabelPrintView
      label={{
        name: product.name, category: product.category, colorName: product.colorName, slug: product.slug,
        price, mrp, discountPercent, qrDataUrl, siteName: settings.siteName,
      }}
    />
  );
}
