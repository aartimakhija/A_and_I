// Exchange requests queue — A&I doesn't offer cash refunds (policy as of Oct
// 2026); every request resolves to a shipped exchange or a store credit.
import { prisma } from "@/lib/prisma";
import ReturnActions from "@/components/admin/ReturnActions";

function resolution(r: { status: string; creditCode: string | null; orderItem: { unitPrice: number; qty: number } }) {
  if (r.status === "EXCHANGED") return "Exchanged";
  if (r.status === "STORE_CREDIT_ISSUED") {
    const amount = `₹${((r.orderItem.unitPrice * r.orderItem.qty) / 100).toLocaleString("en-IN")}`;
    return r.creditCode ? `Credit: ${r.creditCode} (${amount})` : `Credit issued (${amount})`;
  }
  return "—";
}

export default async function AdminReturns() {
  const returns = await prisma.return.findMany({
    include: { order: { select: { number: true, email: true } }, orderItem: { select: { name: true, size: true, unitPrice: true, qty: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <h1>Exchange requests</h1>
      <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>No cash refunds — every request resolves to a size exchange or a store credit.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Order", "Piece", "Reason", "Wants", "Note", "Status", "Resolution", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{returns.map((r) => (
          <tr key={r.id}>
            <td style={{ padding: 8 }}>{r.order.number}</td>
            <td>{r.orderItem.name} ({r.orderItem.size})</td>
            <td>{r.reason.replaceAll("_", " ")}</td>
            <td>{r.preferredSize || "—"}</td>
            <td style={{ maxWidth: 220, fontSize: 12, color: "#666" }}>{r.note ?? "—"}</td>
            <td>{r.status}</td>
            <td>{resolution(r)}</td>
            <td><ReturnActions id={r.id} status={r.status} /></td>
          </tr>
        ))}</tbody>
      </table>
      {returns.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No exchange requests yet.</p>}
    </>
  );
}
