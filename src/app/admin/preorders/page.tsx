// Pre-orders — validates demand before production. The "Production planning"
// table answers the question the business plan's inventory philosophy
// hinges on: exactly how many of each size to actually make.
import { prisma } from "@/lib/prisma";

export default async function AdminPreorders() {
  const [grouped, recent] = await Promise.all([
    prisma.preOrder.groupBy({ by: ["productId", "size"], where: { status: { not: "CANCELLED" } }, _sum: { qty: true } }),
    prisma.preOrder.findMany({ include: { product: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" }, take: 200 }),
  ]);
  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, name: true, preOrder: true },
  });
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  // group the grouped rows by product for a readable table
  const byProduct = new Map<string, { name: string; sizes: { size: string; qty: number }[]; total: number }>();
  for (const g of grouped) {
    const name = byId[g.productId]?.name ?? "Unknown";
    const entry = byProduct.get(g.productId) ?? { name, sizes: [], total: 0 };
    const qty = g._sum.qty ?? 0;
    entry.sizes.push({ size: g.size, qty });
    entry.total += qty;
    byProduct.set(g.productId, entry);
  }

  return (
    <>
      <h1>Pre-orders</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Demand reserved before production — no payment taken yet, just committed interest.</p>

      <h2 style={{ fontSize: 16, marginTop: 32 }}>Production planning</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, background: "#fff", border: "1px solid #eee" }}>
        <thead><tr>{["Piece", "By size", "Total to make"].map((h) => <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee", fontSize: 12 }}>{h}</th>)}</tr></thead>
        <tbody>{[...byProduct.entries()].map(([id, p]) => (
          <tr key={id}>
            <td style={{ padding: 8 }}>{p.name}</td>
            <td style={{ padding: 8, fontSize: 13 }}>{p.sizes.map((s) => `${s.size}: ${s.qty}`).join("  ·  ")}</td>
            <td style={{ padding: 8, fontWeight: 600 }}>{p.total}</td>
          </tr>
        ))}</tbody>
      </table>
      {byProduct.size === 0 && <p style={{ color: "#999", marginTop: 12 }}>No pre-orders yet.</p>}

      <h2 style={{ fontSize: 16, marginTop: 36 }}>All requests</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead><tr>{["Date", "Piece", "Size", "Qty", "Email", "Phone", "Code", "Status"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{recent.map((r) => (
          <tr key={r.id}>
            <td style={{ padding: 8, fontSize: 12, whiteSpace: "nowrap" }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
            <td>{r.product.name}</td><td>{r.size}</td><td>{r.qty}</td>
            <td style={{ fontSize: 13 }}>{r.email}</td><td style={{ fontSize: 13 }}>{r.phone ?? "—"}</td>
            <td style={{ fontSize: 12, fontFamily: "monospace" }}>{r.discountCode}</td>
            <td>{r.status}</td>
          </tr>
        ))}</tbody>
      </table>
      {recent.length === 0 && <p style={{ color: "#999", marginTop: 12 }}>Nothing yet — once a product has "Open for pre-order" checked, its PDP will offer this instead of Add to Bag.</p>}
    </>
  );
}
