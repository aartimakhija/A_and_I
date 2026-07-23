// Vendor sees ONLY order lines for their own products (production queue)
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
export default async function VendorOrders() {
  const s = await getSession();
  const items = await prisma.orderItem.findMany({
    where: { vendorId: s.vendorId! },
    include: { order: { select: { number: true, status: true, shipCity: true, shipState: true, createdAt: true } } },
    orderBy: { id: "desc" }, take: 200,
  });
  return (
    <>
      <h1>My Orders</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Order", "Piece", "Size", "Tier", "Qty", "Ship to", "Status"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{items.map((i) => (
          <tr key={i.id}><td style={{ padding: 8 }}>{i.order.number}</td><td>{i.name}</td><td>{i.size}</td><td>{i.tier ?? "—"}</td>
            <td>{i.qty}</td><td>{i.order.shipCity}, {i.order.shipState}</td><td>{i.order.status}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
}
