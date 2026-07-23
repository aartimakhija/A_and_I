// Returns & refunds queue
import { prisma } from "@/lib/prisma";
import ReturnActions from "@/components/admin/ReturnActions";

export default async function AdminReturns() {
  const returns = await prisma.return.findMany({
    include: { order: { select: { number: true, email: true } }, orderItem: { select: { name: true, size: true, unitPrice: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <h1>Returns &amp; refunds</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Order", "Piece", "Reason", "Note", "Status", "Refund", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{returns.map((r) => (
          <tr key={r.id}>
            <td style={{ padding: 8 }}>{r.order.number}</td>
            <td>{r.orderItem.name} ({r.orderItem.size})</td>
            <td>{r.reason.replaceAll("_", " ")}</td>
            <td style={{ maxWidth: 220, fontSize: 12, color: "#666" }}>{r.note ?? "—"}</td>
            <td>{r.status}</td>
            <td>{r.refundAmount ? `₹${(r.refundAmount / 100).toLocaleString("en-IN")}` : "—"}</td>
            <td><ReturnActions id={r.id} status={r.status} /></td>
          </tr>
        ))}</tbody>
      </table>
      {returns.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No return requests yet.</p>}
    </>
  );
}
