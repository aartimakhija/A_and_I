// Vendor sees ONLY order lines for their own products (production queue)
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import Link from "next/link";

const PAGE_SIZE = 200;

export default async function VendorOrders({ searchParams }: { searchParams: { page?: string } }) {
  const s = await getSession();
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const where = { vendorId: s.vendorId! };
  const [items, total] = await Promise.all([
    prisma.orderItem.findMany({
      where,
      include: { order: { select: { number: true, status: true, shipCity: true, shipState: true, createdAt: true } } },
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.orderItem.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
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
      {items.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>No order lines on this page.</p>}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, fontSize: 13 }}>
        {page > 1
          ? <Link href={`/vendor/orders?page=${page - 1}`} style={{ color: "#0a0a0a" }}>← Newer</Link>
          : <span style={{ color: "#ccc" }}>← Newer</span>}
        <span style={{ color: "#666" }}>Page {page} of {totalPages} · {total} line{total === 1 ? "" : "s"} total</span>
        {page < totalPages
          ? <Link href={`/vendor/orders?page=${page + 1}`} style={{ color: "#0a0a0a" }}>Older →</Link>
          : <span style={{ color: "#ccc" }}>Older →</span>}
      </div>
    </>
  );
}
