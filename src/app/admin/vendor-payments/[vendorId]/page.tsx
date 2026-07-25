import { notFound } from "next/navigation";
import Link from "next/link";
import { getVendorLedgerDetail } from "@/lib/vendor-ledger";
import RecordPaymentForm from "@/components/admin/RecordPaymentForm";

export default async function VendorLedgerPage({ params }: { params: { vendorId: string } }) {
  const ledger = await getVendorLedgerDetail(params.vendorId);
  if (!ledger) notFound();

  const card = { background: "#fff", border: "1px solid #eee", padding: 20 };

  return (
    <>
      <h1>{ledger.vendorName}</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Vendor payment ledger</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 20 }}>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Payable</div><h2>₹{(ledger.payable / 100).toLocaleString("en-IN")}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Paid</div><h2>₹{(ledger.paid / 100).toLocaleString("en-IN")}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Balance</div><h2 style={{ color: ledger.balance > 0 ? "#B0503E" : "#1a7a3c" }}>₹{(ledger.balance / 100).toLocaleString("en-IN")}</h2></div>
      </div>

      <div style={{ marginTop: 24 }}>
        <RecordPaymentForm vendorId={ledger.vendorId} defaultAmount={ledger.balance > 0 ? ledger.balance : undefined} />
      </div>

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Completed production orders</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["PO Number", "Completed", "Total", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>
          {ledger.completedOrders.map((po) => (
            <tr key={po.id}>
              <td style={{ padding: 8 }}>{po.poNumber}</td>
              <td style={{ padding: 8, fontSize: 12, color: "#666" }}>{new Date(po.completedAt).toLocaleDateString("en-IN")}</td>
              <td style={{ padding: 8 }}>₹{(po.total / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8 }}><Link href={`/admin/purchase-orders/${po.id}`} style={{ fontSize: 12, color: "#0a0a0a" }}>View →</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      {ledger.completedOrders.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>No completed production orders yet.</p>}

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Payment history</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead><tr>{["Date", "Amount", "Method", "Reference", "Notes"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>
          {ledger.payments.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 8, fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
              <td style={{ padding: 8 }}>₹{(p.amount / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8 }}>{p.method ?? "—"}</td>
              <td style={{ padding: 8, fontSize: 12, fontFamily: "monospace" }}>{p.reference ?? "—"}</td>
              <td style={{ padding: 8, fontSize: 12, color: "#666" }}>{p.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ledger.payments.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>No payments recorded yet.</p>}
    </>
  );
}
