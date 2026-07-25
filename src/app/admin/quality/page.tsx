import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function QualityQueue() {
  const orders = await prisma.purchaseOrder.findMany({
    where: { status: { in: ["IN_PROGRESS", "READY_FOR_PICKUP"] } },
    include: { vendor: { select: { name: true } }, items: { include: { qualityChecks: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const recentChecks = await prisma.qualityCheck.findMany({
    include: { poItem: { include: { po: { select: { poNumber: true, id: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <>
      <h1>Quality Control</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Production orders with finished goods awaiting inspection. Passing units updates stock automatically.</p>

      <h2 style={{ fontSize: 16, marginTop: 28 }}>Awaiting QC</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["PO Number", "Vendor", "Status", "Progress", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>
          {orders.map((o) => {
            const totalQty = o.items.reduce((s, it) => s + it.qty, 0);
            const checkedQty = o.items.reduce((s, it) => s + it.qualityChecks.reduce((s2, c) => s2 + c.qtyChecked, 0), 0);
            return (
              <tr key={o.id}>
                <td style={{ padding: 8 }}>{o.poNumber}</td>
                <td>{o.vendor.name}</td>
                <td>{o.status.replaceAll("_", " ")}</td>
                <td>{checkedQty}/{totalQty} inspected</td>
                <td><Link href={`/admin/purchase-orders/${o.id}`} style={{ fontSize: 12, color: "#0a0a0a" }}>Run QC →</Link></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {orders.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>Nothing in production right now.</p>}

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Recent QC results</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead><tr>{["Date", "PO", "Result", "Pass/Fail", "Notes"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>
          {recentChecks.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: 8, fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
              <td><Link href={`/admin/purchase-orders/${c.poItem.po.id}`} style={{ fontSize: 12, color: "#0a0a0a" }}>{c.poItem.po.poNumber}</Link></td>
              <td style={{ color: c.result === "PASSED" ? "#1a7a3c" : c.result === "FAILED" ? "#B0503E" : "#8a6d1a" }}>{c.result}</td>
              <td>{c.qtyPassed} / {c.qtyFailed}</td>
              <td style={{ fontSize: 12, color: "#666" }}>{c.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {recentChecks.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>No QC checks recorded yet.</p>}
    </>
  );
}
