import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payment: true, shipment: { include: { events: { orderBy: { at: "desc" } } } }, returns: true },
  });
  if (!order) notFound();

  return (
    <>
      <h1>Order {order.number}</h1>
      <p style={{ color: "#666", marginTop: -8 }}>{order.email} · ₹{(order.total / 100).toLocaleString("en-IN")} · {order.status}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Items</div>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #eee" }}>
            <thead><tr>{["Piece", "Size", "Tier", "Qty", "Price"].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
            <tbody>{order.items.map((i) => (
              <tr key={i.id}><td style={{ padding: 8 }}>{i.name}</td><td>{i.size}</td><td>{i.tier ?? "—"}</td><td>{i.qty}</td><td>₹{(i.unitPrice / 100).toLocaleString("en-IN")}</td></tr>
            ))}</tbody>
          </table>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Shipping address</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#444" }}>
              {order.shipName}<br />{order.shipPhone}<br />{order.shipLine1}<br />{order.shipCity}, {order.shipState} {order.shipPincode}
            </p>
          </div>

          {order.shipment?.events?.length ? (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Tracking timeline</div>
              {order.shipment.events.map((e) => (
                <div key={e.id} style={{ fontSize: 12, color: "#666", padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
                  {new Date(e.at).toLocaleString("en-IN")} — {e.status.replaceAll("_", " ")}{e.note ? ` (${e.note})` : ""}
                </div>
              ))}
            </div>
          ) : null}

          {order.returns.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Returns on this order</div>
              {order.returns.map((r) => (
                <div key={r.id} style={{ fontSize: 12, color: "#666", padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
                  {r.reason.replaceAll("_", " ")} — {r.status}{r.refundAmount ? ` — refunded ₹${(r.refundAmount / 100).toLocaleString("en-IN")}` : ""}
                </div>
              ))}
            </div>
          )}
        </div>

        <OrderStatusForm
          orderId={order.id}
          currentStatus={order.status}
          shipment={order.shipment ? { carrier: order.shipment.carrier, trackingNumber: order.shipment.trackingNumber, status: order.shipment.status } : null}
        />
      </div>
    </>
  );
}
