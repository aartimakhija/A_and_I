import Link from "next/link";
const nav = [["/admin", "Dashboard"], ["/admin/orders", "Orders (OMS)"], ["/admin/products", "Catalogue (CMS)"], ["/admin/vendors", "Vendors"], ["/admin/returns", "Returns & Refunds"], ["/admin/messages", "Messages"]];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "#33301f", color: "#F0EBE3", padding: 24 }}>
        <div style={{ fontWeight: 600, letterSpacing: 2, marginBottom: 24 }}>A &amp; I · ADMIN</div>
        {nav.map(([h, l]) => <Link key={h} href={h} style={{ display: "block", color: "#F0EBE3", padding: "8px 0", textDecoration: "none" }}>{l}</Link>)}
      </aside>
      <main style={{ padding: 32, background: "#fbf8f5" }}>{children}</main>
    </div>
  );
}
