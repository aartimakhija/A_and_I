import Link from "next/link";
import { getProductionPlan } from "@/lib/production-planning";

export default async function ProductionPlanning() {
  const plan = await getProductionPlan();

  return (
    <>
      <h1>Production Planning</h1>
      <p style={{ color: "#666", marginTop: -8 }}>
        Real demand (unshipped paid orders + pending pre-orders) against current stock, checked against material availability.
        Only products that actually need a production decision are listed below.
      </p>

      {plan.length === 0 ? (
        <p style={{ color: "#999", marginTop: 24 }}>Nothing needs production right now — demand is fully covered by current stock.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, background: "#fff", border: "1px solid #eee" }}>
          <thead>
            <tr>{["Piece", "Vendor", "Orders", "Pre-orders", "In stock", "To produce", "Materials", ""].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {plan.map((row) => (
              <tr key={row.productId} style={{ background: row.materialsOk ? undefined : "#fdf6e8" }}>
                <td style={{ padding: 8 }}>{row.productName}</td>
                <td style={{ padding: 8, fontSize: 13 }}>{row.vendorName}</td>
                <td style={{ padding: 8 }}>{row.demandFromOrders}</td>
                <td style={{ padding: 8 }}>{row.demandFromPreorders}</td>
                <td style={{ padding: 8 }}>{row.availableStock}</td>
                <td style={{ padding: 8, fontWeight: 600 }}>{row.netToProduce}</td>
                <td style={{ padding: 8, fontSize: 12 }}>
                  {row.materials.length === 0 ? (
                    <span style={{ color: "#999" }}>No BOM set</span>
                  ) : row.materialsOk ? (
                    <span style={{ color: "#1a7a3c" }}>Sufficient</span>
                  ) : (
                    <span style={{ color: "#B0503E" }}>
                      Short: {row.materials.filter((m) => m.shortfall > 0).map((m) => `${m.name} (−${m.shortfall.toFixed(1)} ${m.unit})`).join(", ")}
                    </span>
                  )}
                </td>
                <td style={{ padding: 8 }}>
                  <Link href={`/admin/purchase-orders/new?vendorId=${row.vendorId}&productId=${row.productId}&qty=${row.netToProduce}`} style={{ fontSize: 12, color: "#0a0a0a" }}>
                    Create Production Order
                  </Link>
                  {!row.materialsOk && (
                    <>
                      {" · "}
                      <Link href="/admin/material-orders/new" style={{ fontSize: 12, color: "#B0503E" }}>Order materials</Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
