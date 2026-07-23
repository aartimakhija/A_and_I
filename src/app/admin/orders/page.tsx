// OMS — all orders
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function AdminOrders() {
  const orders = await prisma.order.findMany({ include: { items: true, payment: true, shipment: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <>
      <h1>Orders (OMS)</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Number", "Email", "Items", "Total", "Payment", "Status", "Delivery", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{orders.map((o) => (
          <tr key={o.id}>
            <td style={{ padding: 8 }}>{o.number}</td><td>{o.email}</td><td>{o.items.length}</td>
            <td>₹{(o.total / 100).toLocaleString("en-IN")}</td><td>{o.payment?.status}</td><td>{o.status}</td>
            <td>{o.shipment ? `${o.shipment.carrier ?? "—"} · ${o.shipment.status.replaceAll("_", " ")}` : "—"}</td>
            <td><Link href={`/admin/orders/${o.id}`} style={{ fontSize: 12, color: "#0a0a0a" }}>Manage</Link></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
