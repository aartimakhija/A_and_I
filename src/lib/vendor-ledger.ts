import { prisma } from "@/lib/prisma";

export type VendorLedgerRow = { vendorId: string; vendorName: string; payable: number; paid: number; balance: number };

/** Every vendor's payable (from COMPLETED production orders) vs. paid vs. outstanding balance, in paise. */
export async function getVendorLedgers(): Promise<VendorLedgerRow[]> {
  const vendors = await prisma.vendor.findMany({
    include: {
      purchaseOrders: { where: { status: "COMPLETED" }, include: { items: true } },
      payouts: true,
    },
  });

  return vendors.map((v) => {
    const payable = v.purchaseOrders.reduce((s, po) => s + po.items.reduce((s2, it) => s2 + it.qty * it.unitCost, 0), 0);
    const paid = v.payouts.reduce((s, p) => s + p.amount, 0);
    return { vendorId: v.id, vendorName: v.name, payable, paid, balance: payable - paid };
  });
}

export async function getVendorLedgerDetail(vendorId: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      purchaseOrders: { where: { status: "COMPLETED" }, include: { items: true }, orderBy: { createdAt: "desc" } },
      payouts: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!vendor) return null;

  const payable = vendor.purchaseOrders.reduce((s, po) => s + po.items.reduce((s2, it) => s2 + it.qty * it.unitCost, 0), 0);
  const paid = vendor.payouts.reduce((s, p) => s + p.amount, 0);

  return {
    vendorId: vendor.id, vendorName: vendor.name, payable, paid, balance: payable - paid,
    completedOrders: vendor.purchaseOrders.map((po) => ({
      id: po.id, poNumber: po.poNumber, total: po.items.reduce((s, it) => s + it.qty * it.unitCost, 0), completedAt: po.updatedAt,
    })),
    payments: vendor.payouts,
  };
}
