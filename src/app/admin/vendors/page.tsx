// Vendor management
import { prisma } from "@/lib/prisma";
import VendorActions from "@/components/admin/VendorActions";

export default async function AdminVendors() {
  const vendors = await prisma.vendor.findMany({ include: { _count: { select: { products: true } } } });
  return (
    <>
      <h1>Vendors</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Name", "Email", "Status", "Commission", "MOQ", "Products", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{vendors.map((v) => (
          <tr key={v.id}>
            <td style={{ padding: 8 }}>{v.name}</td><td>{v.email}</td><td>{v.status}</td>
            <td>{(v.commission * 100).toFixed(0)}%</td><td>{v.moq}</td><td>{v._count.products}</td>
            <td><VendorActions id={v.id} status={v.status} /></td>
          </tr>
        ))}</tbody>
      </table>
    </>
  );
}
