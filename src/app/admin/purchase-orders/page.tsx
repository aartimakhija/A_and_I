import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PurchaseOrdersList() {
  const pos = await prisma.purchaseOrder.findMany({
    include: { vendor: { select: { name: true } }, items: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Production orders</h1>
        <Link href="/admin/purchase-orders/new" style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", textDecoration: "none", fontSize: 13 }}>
          + New production order
        </Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["PO Number", "Vendor", "Items", "Total", "Status", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{pos.map((po) => (
          <tr key={po.id}>
            <td style={{ padding: 8 }}>{po.poNumber}</td>
            <td>{po.vendor.name}</td>
            <td>{po.items.length}</td>
            <td>₹{(po.items.reduce((s, it) => s + it.qty * it.unitCost, 0) / 100).toLocaleString("en-IN")}</td>
            <td>{po.status}</td>
            <td><Link href={`/admin/purchase-orders/${po.id}`} style={{ fontSize: 12, color: "#0a0a0a" }}>View / Print</Link></td>
          </tr>
        ))}</tbody>
      </table>
      {pos.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No purchase orders yet.</p>}
    </>
  );
}
