"use client";

type PO = {
  poNumber: string; notes: string | null; terms: string | null; status: string; createdAt: string;
  vendor: { name: string; email: string; phone: string | null };
  items: { description: string; qty: number; unitCost: number }[];
};

export function POPrintView({ po, siteName }: { po: PO; siteName: string }) {
  const total = po.items.reduce((s, it) => s + it.qty * it.unitCost, 0);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print" style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        <button onClick={() => window.print()} style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
          Print / Save as PDF
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111", paddingBottom: 16 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{siteName}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Purchase Order</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{po.poNumber}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{new Date(po.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{po.status}</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#999" }}>Vendor</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{po.vendor.name}</div>
        <div style={{ fontSize: 13, color: "#555" }}>{po.vendor.email}{po.vendor.phone ? ` · ${po.vendor.phone}` : ""}</div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 28 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #111" }}>
            {["Description", "Qty", "Unit cost", "Line total"].map((h) => (
              <th key={h} style={{ textAlign: h === "Description" ? "left" : "right", padding: "8px 4px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {po.items.map((it, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px 4px" }}>{it.description}</td>
              <td style={{ padding: "10px 4px", textAlign: "right" }}>{it.qty}</td>
              <td style={{ padding: "10px 4px", textAlign: "right" }}>₹{(it.unitCost / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: "10px 4px", textAlign: "right" }}>₹{((it.qty * it.unitCost) / 100).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: 16, fontSize: 18, fontWeight: 700 }}>
        Total: ₹{(total / 100).toLocaleString("en-IN")}
      </div>

      {po.terms && (
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Terms</div>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{po.terms}</p>
        </div>
      )}
    </div>
  );
}
