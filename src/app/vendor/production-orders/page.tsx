import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import Link from "next/link";
import { redirect } from "next/navigation";

const COLUMNS = [
  { statuses: ["DRAFT", "SENT"], label: "Pending" },
  { statuses: ["ACCEPTED"], label: "Accepted" },
  { statuses: ["IN_PROGRESS"], label: "In Progress" },
  { statuses: ["READY_FOR_PICKUP"], label: "Ready for Pickup" },
  { statuses: ["COMPLETED"], label: "Completed" },
] as const;

export default async function VendorProductionOrders() {
  const s = await getSession();
  if (!s.vendorId) redirect("/vendor");

  const orders = await prisma.purchaseOrder.findMany({
    where: { vendorId: s.vendorId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1>Production Orders</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Orders the studio has placed with you, by stage.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginTop: 20 }}>
        {COLUMNS.map((col) => {
          const rows = orders.filter((o) => (col.statuses as readonly string[]).includes(o.status));
          return (
            <div key={col.label} style={{ background: "#fff", border: "1px solid #eee" }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee", fontSize: 12, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                <span>{col.label}</span><span style={{ color: "#999" }}>{rows.length}</span>
              </div>
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {rows.map((o) => (
                  <Link key={o.id} href={`/vendor/production-orders/${o.id}`} style={{ display: "block", padding: "8px 10px", background: "#fbf8f5", textDecoration: "none", color: "#111", fontSize: 12 }}>
                    <div style={{ fontWeight: 600 }}>{o.poNumber}</div>
                    <div style={{ color: "#999" }}>{o.items.length} item(s) · {o.priority}</div>
                    {o.expectedDelivery && <div style={{ color: new Date(o.expectedDelivery) < new Date() && o.status !== "COMPLETED" ? "#B0503E" : "#999" }}>
                      Due {new Date(o.expectedDelivery).toLocaleDateString("en-IN")}
                    </div>}
                  </Link>
                ))}
                {rows.length === 0 && <div style={{ padding: "8px 10px", fontSize: 12, color: "#bbb" }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
