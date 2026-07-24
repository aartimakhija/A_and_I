import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MaterialOrdersList() {
  const orders = await prisma.materialOrder.findMany({
    include: { vendor: { select: { name: true } }, items: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Material orders</h1>
        <Link href="/admin/material-orders/new" style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", textDecoration: "none", fontSize: 13 }}>
          + New material order
        </Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Order #", "Supplier", "Items", "Total", "Expected", "Status", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{orders.map((o) => (
          <tr key={o.id}>
            <td style={{ padding: 8 }}>{o.orderNumber}</td>
            <td>{o.vendor?.name ?? o.supplierName ?? "—"}</td>
            <td>{o.items.length}</td>
            <td>₹{(o.items.reduce((s, it) => s + it.qty * it.rate, 0) / 100).toLocaleString("en-IN")}</td>
            <td style={{ fontSize: 12, color: "#666" }}>{o.expectedDate ? new Date(o.expectedDate).toLocaleDateString("en-IN") : "—"}</td>
            <td>{o.status}</td>
            <td><Link href={`/admin/material-orders/${o.id}`} style={{ fontSize: 12, color: "#0a0a0a" }}>Manage</Link></td>
          </tr>
        ))}</tbody>
      </table>
      {orders.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No material orders yet.</p>}
    </>
  );
}
