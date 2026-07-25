import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";
import { POPrintView } from "@/components/admin/POPrintView";
import QCSection from "@/components/admin/QCSection";

export default async function POPage({ params }: { params: { id: string } }) {
  const [po, settings] = await Promise.all([
    prisma.purchaseOrder.findUnique({
      where: { id: params.id },
      include: { vendor: true, items: { orderBy: { position: "asc" }, include: { qualityChecks: { orderBy: { createdAt: "desc" } } } } },
    }),
    getSiteSettings(),
  ]);
  if (!po) notFound();

  return (
    <>
      <POPrintView
        po={{
          id: po.id, poNumber: po.poNumber, notes: po.notes, terms: po.terms, status: po.status, createdAt: po.createdAt.toISOString(),
          priority: po.priority, expectedDelivery: po.expectedDelivery?.toISOString() ?? null,
          measurementNotes: po.measurementNotes, referenceImages: po.referenceImages,
          vendor: { name: po.vendor.name, email: po.vendor.email, phone: po.vendor.phone },
          items: po.items.map((it) => ({ description: it.description, size: it.size, qty: it.qty, unitCost: it.unitCost })),
        }}
        siteName={settings.siteName}
      />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <QCSection items={po.items.map((it) => ({
          id: it.id, description: it.description, size: it.size, qty: it.qty, productId: it.productId,
          qualityChecks: it.qualityChecks.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
        }))} />
      </div>
    </>
  );
}
