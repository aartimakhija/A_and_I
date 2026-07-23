// CMS — catalogue management
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({ include: { vendor: true, variants: true }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Catalogue (CMS)</h1>
        <Link href="/admin/products/new" style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", textDecoration: "none", fontSize: 13 }}>
          + New product
        </Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Name", "Category", "Vendor", "Price", "Stock", "Status", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{products.map((p) => (
          <tr key={p.id}>
            <td style={{ padding: 8 }}>{p.name}</td><td>{p.category}</td><td>{p.vendor.name}</td>
            <td>₹{(p.basePrice / 100).toLocaleString("en-IN")}</td>
            <td>{p.variants.reduce((s, v) => s + v.stock, 0)}</td>
            <td>{p.status}</td>
            <td><Link href={`/admin/products/${p.id}/edit`} style={{ fontSize: 12, color: "#0a0a0a" }}>Edit</Link></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
