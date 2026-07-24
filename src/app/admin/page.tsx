// Analytics dashboard (Control layer)
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Dashboard() {
  const [orders, paid, products, vendors, materials, pendingReturns, pendingPreorders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: ["PAID", "FULFILLING", "SHIPPED", "DELIVERED"] } } }),
    prisma.product.count(),
    prisma.vendor.count(),
    prisma.material.findMany({ select: { name: true, stockQty: true, reorderLevel: true, unit: true } }),
    prisma.return.count({ where: { status: "REQUESTED" } }),
    prisma.preOrder.count({ where: { status: "PENDING" } }),
  ]);
  const rev = (paid._sum.total ?? 0) / 100;
  const lowMaterials = materials.filter((m) => m.stockQty <= m.reorderLevel);
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
        <div style={{ ...card, borderColor: lowMaterials.length > 0 ? "#e8b04a" : "#eee" }}>
          <div>Low materials</div>
          <h2 style={{ color: lowMaterials.length > 0 ? "#B0503E" : undefined }}>{lowMaterials.length}</h2>
          {lowMaterials.length > 0 && <Link href="/admin/materials" style={{ fontSize: 12 }}>Review →</Link>}
        </div>
        <div style={card}>
          <div>Returns awaiting review</div>
          <h2>{pendingReturns}</h2>
          {pendingReturns > 0 && <Link href="/admin/returns" style={{ fontSize: 12 }}>Review →</Link>}
        </div>
        <div style={card}>
          <div>Pre-orders pending</div>
          <h2>{pendingPreorders}</h2>
          {pendingPreorders > 0 && <Link href="/admin/preorders" style={{ fontSize: 12 }}>Review →</Link>}
        </div>
      </div>
    </>
  );
}
