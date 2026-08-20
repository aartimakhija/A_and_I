// Vendor dashboard — ONLY this vendor's numbers
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { getVendorLedgers } from "@/lib/vendor-ledger";
import Link from "next/link";

export default async function VendorHome() {
  const s = await getSession();
  const vid = s.vendorId!;
  const [vendor, products, items, productionOrders] = await Promise.all([
    prisma.vendor.findUnique({ where: { id: vid } }),
    prisma.product.count({ where: { vendorId: vid } }),
    prisma.orderItem.findMany({ where: { vendorId: vid }, include: { order: true } }),
    prisma.purchaseOrder.findMany({ where: { vendorId: vid } }),
  ]);
  const paidItems = items.filter((i) => ["PAID", "FULFILLING", "SHIPPED", "DELIVERED"].includes(i.order.status));
  const gross = paidItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0) / 100;

  const pending = productionOrders.filter((o) => ["DRAFT", "SENT"].includes(o.status)).length;
  const active = productionOrders.filter((o) => ["ACCEPTED", "IN_PROGRESS"].includes(o.status)).length;
  const completed = productionOrders.filter((o) => o.status === "COMPLETED").length;
  const overdue = productionOrders.filter((o) => o.status !== "COMPLETED" && o.expectedDelivery && new Date(o.expectedDelivery) < new Date()).length;
  const delayRate = productionOrders.length > 0 ? Math.round((overdue / productionOrders.length) * 100) : 0;

  const ledgers = await getVendorLedgers();
  const myLedger = ledgers.find((l) => l.vendorId === vid);

  const card = { background: "#fff", border: "1px solid #eee", padding: 24 };

  return (
    <>
      <h1>Dashboard</h1>
      <p style={{ color: "#666", marginTop: -8 }}>{vendor?.name}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 20 }}>
        <div style={card}><div>Pending orders</div><h2>{pending}</h2>{pending > 0 && <Link href="/vendor/production-orders" style={{ fontSize: 12 }}>Review →</Link>}</div>
        <div style={card}><div>In progress</div><h2>{active}</h2></div>
        <div style={card}><div>Completed</div><h2>{completed}</h2></div>
        <div style={card}><div>Outstanding balance</div><h2 style={{ color: (myLedger?.balance ?? 0) > 0 ? "#B0503E" : undefined }}>₹{((myLedger?.balance ?? 0) / 100).toLocaleString("en-IN")}</h2></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
        <div style={card}><div>My products</div><h2>{products}</h2></div>
        <div style={card}><div>Units sold</div><h2>{paidItems.reduce((sum, i) => sum + i.qty, 0)}</h2></div>
        <div style={card}><div>Gross (pre-commission)</div><h2>₹{gross.toLocaleString("en-IN")}</h2></div>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Your profile</h2>
      <div style={{ ...card, marginTop: 12, maxWidth: 480 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 13 }}>
          <div><span style={{ color: "#999" }}>Commission</span><br />{((vendor?.commission ?? 0) * 100).toFixed(0)}%</div>
          <div><span style={{ color: "#999" }}>Minimum order qty</span><br />{vendor?.moq}</div>
          <div><span style={{ color: "#999" }}>Typical lead time</span><br />{vendor?.leadTimeDays} days</div>
          <div><span style={{ color: "#999" }}>On-time rate</span><br />{100 - delayRate}%</div>
        </div>
      </div>
    </>
  );
}
