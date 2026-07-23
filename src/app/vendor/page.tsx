// Vendor dashboard — ONLY this vendor's numbers
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
export default async function VendorHome() {
  const s = await getSession();
  const vid = s.vendorId!;
  const [products, items] = await Promise.all([
    prisma.product.count({ where: { vendorId: vid } }),
    prisma.orderItem.findMany({ where: { vendorId: vid }, include: { order: true } }),
  ]);
  const paidItems = items.filter((i) => ["PAID", "FULFILLING", "SHIPPED", "DELIVERED"].includes(i.order.status));
  const gross = paidItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0) / 100;
  const card = { background: "#fff", border: "1px solid #eee", padding: 24 };
  return (
    <>
      <h1>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 20 }}>
        <div style={card}><div>My products</div><h2>{products}</h2></div>
        <div style={card}><div>Units sold</div><h2>{paidItems.reduce((s, i) => s + i.qty, 0)}</h2></div>
        <div style={card}><div>Gross (pre-commission)</div><h2>₹{gross.toLocaleString("en-IN")}</h2></div>
      </div>
    </>
  );
}
