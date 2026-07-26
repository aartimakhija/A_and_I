import { prisma } from "@/lib/prisma";

export type Notification = { id: string; type: string; message: string; href: string; severity: "info" | "warning" | "urgent" };

const DAY = 24 * 60 * 60 * 1000;

/**
 * Every notification here is derived live from current data, not stored as
 * a separate event log — simpler, always accurate, and avoids needing to
 * instrument every mutation site in the codebase to fire an event.
 */
export async function getNotifications(): Promise<Notification[]> {
  const now = Date.now();
  const notifications: Notification[] = [];

  const [lowMaterials, recentReceived, overdueProduction, recentQCFails, waitingPreorders, payables, recentApproved, recentCompleted] = await Promise.all([
    prisma.material.findMany({ where: {}, select: { id: true, name: true, stockQty: true, reorderLevel: true } }),
    prisma.materialOrder.findMany({ where: { status: "RECEIVED", updatedAt: { gte: new Date(now - 2 * DAY) } }, select: { id: true, orderNumber: true } }),
    prisma.purchaseOrder.findMany({ where: { status: { notIn: ["COMPLETED"] }, expectedDelivery: { lt: new Date() } }, select: { id: true, poNumber: true, vendor: { select: { name: true } } } }),
    prisma.qualityCheck.findMany({ where: { result: { in: ["FAILED", "PARTIAL"] }, createdAt: { gte: new Date(now - 7 * DAY) } }, include: { poItem: { include: { po: { select: { id: true, poNumber: true } } } } } }),
    prisma.preOrder.findMany({ where: { status: "PENDING" }, select: { id: true } }),
    prisma.vendor.findMany({ include: { purchaseOrders: { where: { status: "COMPLETED" }, include: { items: true } }, payouts: true } }),
    prisma.purchaseOrder.findMany({ where: { status: "ACCEPTED", updatedAt: { gte: new Date(now - 2 * DAY) } }, select: { id: true, poNumber: true } }),
    prisma.purchaseOrder.findMany({ where: { status: "COMPLETED", updatedAt: { gte: new Date(now - 2 * DAY) } }, select: { id: true, poNumber: true } }),
  ]);

  for (const m of lowMaterials) {
    if (m.stockQty <= m.reorderLevel) {
      notifications.push({ id: `low-material-${m.id}`, type: "Low Inventory", message: `${m.name} is at or below reorder level`, href: "/admin/materials", severity: "warning" });
    }
  }
  for (const mo of recentReceived) {
    notifications.push({ id: `received-${mo.id}`, type: "Material Received", message: `${mo.orderNumber} was received — stock updated`, href: `/admin/material-orders/${mo.id}`, severity: "info" });
  }
  for (const po of overdueProduction) {
    notifications.push({ id: `delay-${po.id}`, type: "Vendor Delay", message: `${po.poNumber} (${po.vendor.name}) is past its expected delivery date`, href: `/admin/purchase-orders/${po.id}`, severity: "urgent" });
  }
  for (const qc of recentQCFails) {
    notifications.push({ id: `qc-${qc.id}`, type: "QC Failed", message: `QC on ${qc.poItem.po.poNumber} had ${qc.qtyFailed} failed unit(s)`, href: `/admin/purchase-orders/${qc.poItem.po.id}`, severity: "urgent" });
  }
  if (waitingPreorders.length > 0) {
    notifications.push({ id: "customers-waiting", type: "Customer Waiting", message: `${waitingPreorders.length} pre-order lead(s) awaiting a reply`, href: "/admin/preorders", severity: "warning" });
  }
  for (const v of payables) {
    const payable = v.purchaseOrders.reduce((s, po) => s + po.items.reduce((s2, it) => s2 + it.qty * it.unitCost, 0), 0);
    const paid = v.payouts.reduce((s, p) => s + p.amount, 0);
    if (payable - paid > 0) {
      notifications.push({ id: `payable-${v.id}`, type: "Payment Due", message: `${v.name} is owed ₹${((payable - paid) / 100).toLocaleString("en-IN")}`, href: `/admin/vendor-payments/${v.id}`, severity: "warning" });
    }
  }
  for (const po of recentApproved) {
    notifications.push({ id: `approved-${po.id}`, type: "PO Approved", message: `${po.poNumber} was accepted by the vendor`, href: `/admin/purchase-orders/${po.id}`, severity: "info" });
  }
  for (const po of recentCompleted) {
    notifications.push({ id: `complete-${po.id}`, type: "Production Complete", message: `${po.poNumber} is complete`, href: `/admin/purchase-orders/${po.id}`, severity: "info" });
  }

  const order = { urgent: 0, warning: 1, info: 2 };
  return notifications.sort((a, b) => order[a.severity] - order[b.severity]);
}
