import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import RequestReturn from "@/components/store/RequestReturn";

export default async function Orders() {
  const s = await getSession();
  const orders = await prisma.order.findMany({
    where: { userId: s.userId },
    include: { items: true, shipment: true, returns: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1>Order history</h1>
      {orders.map((o) => (
        <div key={o.id} style={{ border: "1px solid #eee", padding: 20, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{o.number}</strong>
            <span>{o.status}{o.shipment?.trackingNumber ? ` · ${o.shipment.carrier} ${o.shipment.trackingNumber}` : ""}</span>
          </div>
          <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>₹{(o.total / 100).toLocaleString("en-IN")}</div>
          <div style={{ marginTop: 12 }}>
            {o.items.map((item) => {
              const existingReturn = o.returns.find((r) => r.orderItemId === item.id);
              return (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid #f5f5f5" }}>
                  <span style={{ fontSize: 13 }}>{item.name} · {item.size}</span>
                  {["SHIPPED", "DELIVERED"].includes(o.status) && (
                    existingReturn
                      ? <span style={{ fontSize: 12, color: "#666" }}>{existingReturn.status === "REQUESTED" ? "Return requested ✓" : `Return: ${existingReturn.status}`}</span>
                      : <RequestReturn orderItemId={item.id} email={o.email} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {orders.length === 0 && <p style={{ color: "#999" }}>No orders yet.</p>}
    </main>
  );
}
