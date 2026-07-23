// Analytics dashboard (Control layer)
import { prisma } from "@/lib/prisma";
export default async function Dashboard() {
  const [orders, paid, products, vendors] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: ["PAID", "FULFILLING", "SHIPPED", "DELIVERED"] } } }),
    prisma.product.count(),
    prisma.vendor.count(),
  ]);
  const rev = (paid._sum.total ?? 0) / 100;
  const card = { background: "#fff", border: "1px solid #eee", padding: 24 };
  return (
    <>
      <h1>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 20 }}>
        <div style={card}><div>Revenue</div><h2>₹{rev.toLocaleString("en-IN")}</h2></div>
        <div style={card}><div>Orders</div><h2>{orders}</h2></div>
        <div style={card}><div>Products</div><h2>{products}</h2></div>
        <div style={card}><div>Vendors</div><h2>{vendors}</h2></div>
      </div>
    </>
  );
}
