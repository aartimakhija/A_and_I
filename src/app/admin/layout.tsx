import AdminNav from "@/components/admin/AdminNav";
import AdminHeader from "@/components/admin/AdminHeader";
// Admin data (orders, products, vendors) must always be live, and shouldn't
// ever be attempted at build time — same reasoning as the storefront layout.
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "#33301f", color: "#F0EBE3", padding: 24, overflowY: "auto" }}>
        <div style={{ fontWeight: 600, letterSpacing: 2, marginBottom: 24 }}>A&amp;I · ADMIN</div>
        <AdminNav />
      </aside>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <main style={{ padding: 32, background: "#fbf8f5", flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
