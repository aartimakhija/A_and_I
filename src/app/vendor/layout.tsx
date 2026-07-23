import Link from "next/link";
import { getSession } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
const nav = [["/vendor", "Dashboard"], ["/vendor/orders", "My Orders"], ["/vendor/products", "My Products"]];
export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  const vendor = s.vendorId ? await prisma.vendor.findUnique({ where: { id: s.vendorId } }) : null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "#0a0a0a", color: "#F0EBE3", padding: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{vendor?.name ?? "Vendor"}</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 24 }}>Vendor Portal</div>
        {nav.map(([h, l]) => <Link key={h} href={h} style={{ display: "block", color: "#F0EBE3", padding: "8px 0", textDecoration: "none" }}>{l}</Link>)}
      </aside>
      <main style={{ padding: 32, background: "#fbf8f5" }}>{children}</main>
    </div>
  );
}
