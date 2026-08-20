import { getSession } from "@/lib/rbac";
import { getVendorLedgerDetail } from "@/lib/vendor-ledger";
import { redirect } from "next/navigation";

export default async function VendorPayments() {
  const s = await getSession();
  if (!s.vendorId) redirect("/vendor");

  const ledger = await getVendorLedgerDetail(s.vendorId);
  if (!ledger) redirect("/vendor");

  const card = { background: "#fff", border: "1px solid #eee", padding: 20 };

  return (
    <>
      <h1>Payments</h1>
      <p style={{ color: "#666", marginTop: -8 }}>What the studio owes you for completed production, and what's already been paid.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 20 }}>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Total payable</div><h2>₹{(ledger.payable / 100).toLocaleString("en-IN")}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Paid so far</div><h2>₹{(ledger.paid / 100).toLocaleString("en-IN")}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Outstanding</div><h2 style={{ color: ledger.balance > 0 ? "#B0503E" : "#1a7a3c" }}>₹{(ledger.balance / 100).toLocaleString("en-IN")}</h2></div>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Payment history</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead><tr>{["Date", "Amount", "Method", "Reference"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>
          {ledger.payments.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 8, fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
              <td style={{ padding: 8 }}>₹{(p.amount / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8 }}>{p.method ?? "—"}</td>
              <td style={{ padding: 8, fontSize: 12, fontFamily: "monospace" }}>{p.reference ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ledger.payments.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>No payments recorded yet.</p>}
    </>
  );
}
