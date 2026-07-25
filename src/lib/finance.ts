import { prisma } from "@/lib/prisma";
import { getVendorLedgers } from "@/lib/vendor-ledger";

export async function getFinanceSummary() {
  const [orders, materials, vendorLedgers, pendingOrders, materialOrdersReceived, products] = await Promise.all([
    prisma.orderItem.findMany({
      where: { order: { status: { in: ["PAID", "FULFILLING", "SHIPPED", "DELIVERED"] } } },
      include: { product: { select: { id: true, name: true, category: true, vendorId: true, vendor: { select: { name: true } }, costPrice: true } } },
    }),
    prisma.material.findMany({ select: { stockQty: true, costPerUnit: true } }),
    getVendorLedgers(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: "PENDING" } }),
    prisma.materialOrder.findMany({ where: { status: "RECEIVED" }, include: { items: true } }),
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: { variants: true } }),
  ]);

  // Revenue & COGS — only counted where a cost price has actually been set;
  // products missing one are flagged rather than silently treated as free.
  let revenue = 0, cogs = 0, missingCostCount = 0;
  const byProduct = new Map<string, { name: string; category: string; vendorName: string; revenue: number; cost: number; qty: number }>();
  const byVendor = new Map<string, { name: string; revenue: number; cost: number }>();
  const byCategory = new Map<string, { revenue: number; cost: number }>();

  for (const it of orders) {
    const lineRevenue = it.qty * it.unitPrice;
    revenue += lineRevenue;
    const cost = it.product?.costPrice;
    const lineCost = cost != null ? it.qty * cost : 0;
    if (cost == null) missingCostCount++;
    cogs += lineCost;

    if (it.product) {
      const key = it.product.id;
      const row = byProduct.get(key) ?? { name: it.product.name, category: it.product.category, vendorName: it.product.vendor.name, revenue: 0, cost: 0, qty: 0 };
      row.revenue += lineRevenue; row.cost += lineCost; row.qty += it.qty;
      byProduct.set(key, row);

      const vRow = byVendor.get(it.product.vendorId) ?? { name: it.product.vendor.name, revenue: 0, cost: 0 };
      vRow.revenue += lineRevenue; vRow.cost += lineCost;
      byVendor.set(it.product.vendorId, vRow);

      const cRow = byCategory.get(it.product.category) ?? { revenue: 0, cost: 0 };
      cRow.revenue += lineRevenue; cRow.cost += lineCost;
      byCategory.set(it.product.category, cRow);
    }
  }

  const grossMargin = revenue - cogs;

  // Operating expenses: production paid to vendors + raw materials received.
  const vendorPayments = vendorLedgers.reduce((s, v) => s + v.paid, 0);
  const materialSpend = materialOrdersReceived.reduce((s, mo) => s + mo.items.reduce((s2, it) => s2 + it.qty * it.rate, 0), 0);
  const expenses = vendorPayments + materialSpend;
  const netMargin = grossMargin - expenses;
  const cashFlow = revenue - expenses; // simple net movement, not full accrual accounting

  const inventoryValueFinished = products.reduce((s, p) => s + p.variants.reduce((s2, v) => s2 + v.stock * (p.costPrice ?? p.basePrice), 0), 0);
  const inventoryValueMaterials = materials.reduce((s, m) => s + m.stockQty * m.costPerUnit, 0);
  const inventoryValue = inventoryValueFinished + inventoryValueMaterials;

  const vendorPayables = vendorLedgers.reduce((s, v) => s + v.balance, 0);
  const customerReceivables = pendingOrders._sum.total ?? 0;

  return {
    revenue, cogs, grossMargin, expenses, netMargin, cashFlow, inventoryValue, vendorPayables, customerReceivables, missingCostCount,
    profitByProduct: [...byProduct.entries()].map(([id, r]) => ({ productId: id, ...r, profit: r.revenue - r.cost })).sort((a, b) => b.profit - a.profit),
    profitByVendor: [...byVendor.entries()].map(([id, r]) => ({ vendorId: id, ...r, profit: r.revenue - r.cost })).sort((a, b) => b.profit - a.profit),
    profitByCategory: [...byCategory.entries()].map(([cat, r]) => ({ category: cat, ...r, profit: r.revenue - r.cost })).sort((a, b) => b.profit - a.profit),
  };
}
