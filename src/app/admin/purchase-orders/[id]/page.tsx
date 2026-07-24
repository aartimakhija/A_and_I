import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";
import { POPrintView } from "@/components/admin/POPrintView";

export default async function POPage({ params }: { params: { id: string } }) {
  const [po, settings] = await Promise.all([
    prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { vendor: true, items: { orderBy: { position: "asc" } } },
    }),
    getSiteSettings(),
  ]);
  if (!po) notFound();

  return (
    <POPrintView
      po={{
        poNumber: po.poNumber, notes: po.notes, terms: po.terms, status: po.status, createdAt: po.createdAt.toISOString(),
        vendor: { name: po.vendor.name, email: po.vendor.email, phone: po.vendor.phone },
        items: po.items.map((it) => ({ description: it.description, qty: it.qty, unitCost: it.unitCost })),
      }}
      siteName={settings.siteName}
    />
  );
}
