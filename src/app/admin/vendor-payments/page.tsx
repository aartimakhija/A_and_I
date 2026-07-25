import Link from "next/link";
import { getVendorLedgers } from "@/lib/vendor-ledger";

export default async function VendorPaymentsList() {
  const ledgers = await getVendorLedgers();

  return (
    <>
      <h1>Vendor payments</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Payable is the total of completed Production Orders. Balance is what's still owed.</p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Vendor", "Payable", "Paid", "Balance", ""].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>
          {ledgers.map((l) => (
            <tr key={l.vendorId} style={{ background: l.balance > 0 ? "#fdf6e8" : undefined }}>
              <td style={{ padding: 8 }}>{l.vendorName}</td>
              <td style={{ padding: 8 }}>₹{(l.payable / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8 }}>₹{(l.paid / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8, fontWeight: 600, color: l.balance > 0 ? "#B0503E" : "#1a7a3c" }}>₹{(l.balance / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8 }}><Link href={`/admin/vendor-payments/${l.vendorId}`} style={{ fontSize: 12, color: "#0a0a0a" }}>View ledger →</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      {ledgers.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No vendors yet.</p>}
    </>
  );
}
