import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { notFound } from "next/navigation";
import AdvanceStatusButton from "@/components/vendor/AdvanceStatusButton";

export default async function VendorProductionOrderDetail({ params }: { params: { id: string } }) {
  const s = await getSession();
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!po || po.vendorId !== s.vendorId) notFound();

  const total = po.items.reduce((sum, it) => sum + it.qty * it.unitCost, 0);

  return (
    <>
      <h1>{po.poNumber}</h1>
      <p style={{ color: "#666", marginTop: -8 }}>
        {po.status.replaceAll("_", " ")} · {po.priority} priority
        {po.expectedDelivery && ` · Expected ${new Date(po.expectedDelivery).toLocaleDateString("en-IN")}`}
      </p>

      <div style={{ marginTop: 20 }}>
        <AdvanceStatusButton id={po.id} status={po.status} />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Description", "Size", "Qty", "Unit cost", "Line total"].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>
          {po.items.map((it) => (
            <tr key={it.id}>
              <td style={{ padding: 8 }}>{it.description}</td>
              <td style={{ padding: 8 }}>{it.size ?? "—"}</td>
              <td style={{ padding: 8 }}>{it.qty}</td>
              <td style={{ padding: 8 }}>₹{(it.unitCost / 100).toLocaleString("en-IN")}</td>
              <td style={{ padding: 8 }}>₹{((it.qty * it.unitCost) / 100).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "right", marginTop: 10, fontSize: 15, fontWeight: 600 }}>Total: ₹{(total / 100).toLocaleString("en-IN")}</div>

      {po.measurementNotes && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#999" }}>Measurements / fit notes</div>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{po.measurementNotes}</p>
        </div>
      )}

      {po.referenceImages.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Reference images</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {po.referenceImages.map((url, i) => <img key={i} src={url} alt="" style={{ width: 100, height: 125, objectFit: "cover", border: "1px solid #ddd" }} />)}
          </div>
        </div>
      )}

      {po.notes && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#999" }}>Notes from the studio</div>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{po.notes}</p>
        </div>
      )}
    </>
  );
}
