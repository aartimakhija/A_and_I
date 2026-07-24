import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MaterialOrderStatus from "@/components/admin/MaterialOrderStatus";

export default async function MaterialOrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.materialOrder.findUnique({
    where: { id: params.id },
    include: { vendor: true, items: { orderBy: { position: "asc" }, include: { material: true } } },
  });
  if (!order) notFound();

  const total = order.items.reduce((s, it) => s + it.qty * it.rate, 0);

  return (
    <>
      <h1>{order.orderNumber}</h1>
      <p style={{ color: "#666", marginTop: -8 }}>{order.vendor?.name ?? order.supplierName ?? "No supplier set"}</p>

      <div style={{ marginTop: 20 }}>
        <MaterialOrderStatus id={order.id} status={order.status} />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Material", "Qty", "Unit", "Rate", "Line total"].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>
          {order.items.map((it) => (
            <tr key={it.id}>
              <td style={{ padding: 8 }}>{it.material.name}</td>
              <td style={{ padding: 8 }}>{it.qty}</td>
              <td style={{ padding: 8 }}>{it.material.unit}</td>
              <td style={{ padding: 8 }}>₹{(it.rate / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8 }}>₹{((it.qty * it.rate) / 100).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "right", marginTop: 10, fontSize: 15, fontWeight: 600 }}>Total: ₹{(total / 100).toLocaleString("en-IN")}</div>

      {order.notes && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#999" }}>Notes</div>
          <p style={{ fontSize: 13, color: "#555" }}>{order.notes}</p>
        </div>
      )}
    </>
  );
}
