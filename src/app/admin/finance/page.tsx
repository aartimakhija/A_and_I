import { getFinanceSummary } from "@/lib/finance";

function inr(paise: number) { return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`; }

export default async function FinanceDashboard() {
  const f = await getFinanceSummary();
  const card = { background: "#fff", border: "1px solid #eee", padding: 20 };
  const negative = { color: "#B0503E" };

  return (
    <>
      <h1>Finance</h1>
      {f.missingCostCount > 0 && (
        <div style={{ background: "#fdf6e8", border: "1px solid #e8d9a8", padding: 12, fontSize: 13, marginTop: 8 }}>
          {f.missingCostCount} order line(s) are from products with no cost price set — margin figures below undercount cost until you fill those in on each product's edit page.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 20 }}>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Revenue</div><h2>{inr(f.revenue)}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Expenses</div><h2>{inr(f.expenses)}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Gross margin</div><h2 style={f.grossMargin < 0 ? negative : undefined}>{inr(f.grossMargin)}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Net margin</div><h2 style={f.netMargin < 0 ? negative : undefined}>{inr(f.netMargin)}</h2></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 16 }}>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Cash flow</div><h2 style={f.cashFlow < 0 ? negative : undefined}>{inr(f.cashFlow)}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Inventory value</div><h2>{inr(f.inventoryValue)}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Vendor payables</div><h2 style={f.vendorPayables > 0 ? negative : undefined}>{inr(f.vendorPayables)}</h2></div>
        <div style={card}><div style={{ fontSize: 12, color: "#999" }}>Customer receivables</div><h2>{inr(f.customerReceivables)}</h2></div>
      </div>

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Profit by product</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Product", "Units sold", "Revenue", "Cost", "Profit"].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>{f.profitByProduct.slice(0, 20).map((r) => (
          <tr key={r.productId}>
            <td style={{ padding: 8 }}>{r.name}</td><td>{r.qty}</td><td>{inr(r.revenue)}</td><td>{inr(r.cost)}</td>
            <td style={r.profit < 0 ? negative : undefined}>{inr(r.profit)}</td>
          </tr>
        ))}</tbody>
      </table>
      {f.profitByProduct.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>No paid orders yet.</p>}

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Profit by vendor</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Vendor", "Revenue", "Cost", "Profit"].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>{f.profitByVendor.map((r) => (
          <tr key={r.vendorId}><td style={{ padding: 8 }}>{r.name}</td><td>{inr(r.revenue)}</td><td>{inr(r.cost)}</td><td style={r.profit < 0 ? negative : undefined}>{inr(r.profit)}</td></tr>
        ))}</tbody>
      </table>

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Profit by category</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Category", "Revenue", "Cost", "Profit"].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>{f.profitByCategory.map((r) => (
          <tr key={r.category}><td style={{ padding: 8 }}>{r.category}</td><td>{inr(r.revenue)}</td><td>{inr(r.cost)}</td><td style={r.profit < 0 ? negative : undefined}>{inr(r.profit)}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
}
