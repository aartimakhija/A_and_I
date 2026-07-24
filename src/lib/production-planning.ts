import { prisma } from "@/lib/prisma";

export type MaterialCheck = { materialId: string; name: string; unit: string; needed: number; available: number; shortfall: number };
export type PlanRow = {
  productId: string; productName: string; productSlug: string; vendorId: string; vendorName: string;
  demandFromOrders: number; demandFromPreorders: number; availableStock: number; netToProduce: number;
  materials: MaterialCheck[]; materialsOk: boolean;
};

/**
 * The Production Planner (Journey 4 — "the heart of the application"):
 * for every active product, works out real demand (unshipped paid orders +
 * pending pre-orders) against current stock, and checks the Bill of
 * Materials against actual material stock so a shortfall is visible before
 * a Production Order gets created, not after.
 */
export async function getProductionPlan(): Promise<PlanRow[]> {
  const products = await prisma.product.findMany({
    where: { status: { in: ["ACTIVE", "SOLD_OUT"] } },
    include: {
      variants: true,
      vendor: { select: { id: true, name: true } },
      bom: { include: { material: { select: { id: true, name: true, unit: true, stockQty: true } } } },
    },
  });

  const [orderItems, preorders] = await Promise.all([
    prisma.orderItem.findMany({
      where: { order: { status: { in: ["PAID", "FULFILLING"] } } },
      select: { productId: true, qty: true },
    }),
    prisma.preOrder.findMany({
      where: { status: { in: ["PENDING", "CONFIRMED"] } },
      select: { productId: true, qty: true },
    }),
  ]);

  const orderDemand = new Map<string, number>();
  for (const it of orderItems) orderDemand.set(it.productId, (orderDemand.get(it.productId) ?? 0) + it.qty);
  const preorderDemand = new Map<string, number>();
  for (const p of preorders) preorderDemand.set(p.productId, (preorderDemand.get(p.productId) ?? 0) + p.qty);

  const rows: PlanRow[] = [];
  for (const p of products) {
    const demandFromOrders = orderDemand.get(p.id) ?? 0;
    const demandFromPreorders = preorderDemand.get(p.id) ?? 0;
    const availableStock = p.variants.reduce((s, v) => s + v.stock, 0);
    const netToProduce = Math.max(0, demandFromOrders + demandFromPreorders - availableStock);
    if (netToProduce === 0) continue; // only surface products that actually need a decision

    const materials: MaterialCheck[] = p.bom.map((row) => {
      const needed = netToProduce * row.qtyPerUnit;
      return {
        materialId: row.material.id, name: row.material.name, unit: row.material.unit,
        needed, available: row.material.stockQty, shortfall: Math.max(0, needed - row.material.stockQty),
      };
    });

    rows.push({
      productId: p.id, productName: p.name, productSlug: p.slug,
      vendorId: p.vendor.id, vendorName: p.vendor.name,
      demandFromOrders, demandFromPreorders, availableStock, netToProduce,
      materials, materialsOk: materials.every((m) => m.shortfall === 0),
    });
  }

  return rows.sort((a, b) => b.netToProduce - a.netToProduce);
}
