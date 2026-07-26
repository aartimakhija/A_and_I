"use client";

type Label = {
  name: string; category: string; colorName: string | null; slug: string;
  price: number; mrp: number | null; discountPercent: number | null;
  qrDataUrl: string; siteName: string;
};

export function LabelPrintView({ label }: { label: Label }) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#111", padding: 40 }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
        .label {
          width: 320px; border: 1px solid #ddd; padding: 24px; margin-bottom: 24px;
          display: inline-block; vertical-align: top; margin-right: 16px;
        }
      `}</style>

      <div className="no-print" style={{ marginBottom: 24 }}>
        <button onClick={() => window.print()} style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
          Print / Save as PDF
        </button>
      </div>

      <div className="label">
        <div style={{ textAlign: "center", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>{label.siteName}</div>
        <div style={{ textAlign: "center", fontSize: 10, color: "#999", marginTop: 2, marginBottom: 16 }}>Made in India, in small runs</div>

        <div style={{ textAlign: "center" }}>
          <img src={label.qrDataUrl} alt="QR" style={{ width: 140, height: 140 }} />
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>{label.name}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
            {label.category}{label.colorName ? ` · ${label.colorName}` : ""}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          {label.mrp && label.discountPercent ? (
            <div>
              <span style={{ fontSize: 13, color: "#999", textDecoration: "line-through", marginRight: 8 }}>₹{label.mrp.toLocaleString("en-IN")}</span>
              <span style={{ fontSize: 17, fontWeight: 700 }}>₹{label.price.toLocaleString("en-IN")}</span>
              <span style={{ fontSize: 11, color: "#1a7a3c", fontWeight: 600, marginLeft: 8 }}>{label.discountPercent}% off</span>
            </div>
          ) : (
            <span style={{ fontSize: 17, fontWeight: 700 }}>₹{label.price.toLocaleString("en-IN")}</span>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 9, letterSpacing: 1, color: "#bbb", fontFamily: "monospace" }}>{label.slug}</div>
      </div>
    </div>
  );
}
