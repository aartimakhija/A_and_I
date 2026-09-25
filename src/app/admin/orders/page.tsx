// OMS — all orders
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 100;

export default async function AdminOrders({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: { items: true, payment: true, shipment: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
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
      {orders.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>No orders on this page.</p>}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, fontSize: 13 }}>
        {page > 1
          ? <Link href={`/admin/orders?page=${page - 1}`} style={{ color: "#0a0a0a" }}>← Newer</Link>
          : <span style={{ color: "#ccc" }}>← Newer</span>}
        <span style={{ color: "#666" }}>Page {page} of {totalPages} · {total} order{total === 1 ? "" : "s"} total</span>
        {page < totalPages
          ? <Link href={`/admin/orders?page=${page + 1}`} style={{ color: "#0a0a0a" }}>Older →</Link>
          : <span style={{ color: "#ccc" }}>Older →</span>}
      </div>
    </>
  );
}
