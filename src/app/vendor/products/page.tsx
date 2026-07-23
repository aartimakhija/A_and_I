// Vendor sees/manages ONLY their own catalogue
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
export default async function VendorProducts() {
  const s = await getSession();
  const products = await prisma.product.findMany({ where: { vendorId: s.vendorId! }, include: { variants: true } });
  return (
    <>
      <h1>My Products</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Name", "Category", "Price", "Stock", "Status"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{products.map((p) => (
          <tr key={p.id}><td style={{ padding: 8 }}>{p.name}</td><td>{p.category}</td>
            <td>₹{(p.basePrice / 100).toLocaleString("en-IN")}</td><td>{p.variants.reduce((s2, v) => s2 + v.stock, 0)}</td><td>{p.status}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
}
