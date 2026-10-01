import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import RequestReturn from "@/components/store/RequestReturn";
import { formatINR } from "@/lib/format";

// A&I doesn't offer cash refunds — these are the customer-facing labels for
// where an exchange request currently stands.
function exchangeStatusLabel(status: string, creditCode: string | null) {
  switch (status) {
    case "REQUESTED": return "Exchange requested ✓";
    case "REJECTED": return "Exchange request declined";
    case "EXCHANGED": return "Exchanged ✓";
    case "STORE_CREDIT_ISSUED": return creditCode ? `Store credit issued: ${creditCode}` : "Store credit issued";
    default: return `Exchange: ${status.replaceAll("_", " ").toLowerCase()}`; // APPROVED / PICKED_UP / RECEIVED
  }
}

export default async function Orders() {
  const s = await getSession();
  const orders = await prisma.order.findMany({
    where: { userId: s.userId },
    include: { items: true, shipment: true, returns: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="shell max-w-3xl py-12">
      <h1 className="display-md mb-6">Order history</h1>
      {orders.map((o) => (
        <div key={o.id} className="mt-4 border border-border p-5">
          <div className="flex justify-between">
            <strong className="font-normal">{o.number}</strong>
            <span className="text-sm text-muted-foreground">{o.status}{o.shipment?.trackingNumber ? ` · ${o.shipment.carrier} ${o.shipment.trackingNumber}` : ""}</span>
          </div>
          <div className="mt-1 text-[13px] text-muted-foreground">{formatINR(o.total / 100)}</div>
          <div className="mt-3">
            {o.items.map((item) => {
              const existingReturn = o.returns.find((r) => r.orderItemId === item.id);
              return (
                <div key={item.id} className="flex items-center justify-between border-t border-border py-2">
                  <span className="text-[13px]">{item.name} · {item.size}</span>
                  {["SHIPPED", "DELIVERED"].includes(o.status) && (
                    existingReturn
                      ? <span className="text-xs text-muted-foreground">{exchangeStatusLabel(existingReturn.status, existingReturn.creditCode)}</span>
                      : <RequestReturn orderItemId={item.id} email={o.email} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
    </main>
  );
}
