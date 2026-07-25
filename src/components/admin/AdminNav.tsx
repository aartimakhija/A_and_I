"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS: [string, [string, string][]][] = [
  ["Overview", [
    ["/admin", "Dashboard"],
    ["/admin/planning", "Production Planning"],
  ]],
  ["Sales", [
    ["/admin/orders", "Orders (OMS)"],
    ["/admin/preorders", "Pre-orders"],
    ["/admin/returns", "Returns & Refunds"],
  ]],
  ["Catalogue", [
    ["/admin/products", "Catalogue (CMS)"],
    ["/admin/categories", "Categories"],
    ["/admin/blog", "Journal"],
  ]],
  ["Production", [
    ["/admin/materials", "Materials"],
    ["/admin/material-orders", "Material Orders"],
    ["/admin/vendors", "Vendors"],
    ["/admin/purchase-orders", "Production Orders"],
    ["/admin/quality", "Quality Control"],
    ["/admin/vendor-payments", "Vendor Payments"],
  ]],
  ["Finance", [
    ["/admin/finance", "Finance"],
  ]],
  ["System", [
    ["/admin/messages", "Messages"],
    ["/admin/settings", "Settings"],
  ]],
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <>
      {GROUPS.map(([group, items]) => (
        <div key={group} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(240,235,227,0.4)", marginBottom: 6 }}>{group}</div>
          {items.map(([href, label]) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: "block", padding: "7px 8px", margin: "0 -8px", borderRadius: 3, textDecoration: "none",
                color: active ? "#33301f" : "#F0EBE3", background: active ? "#F0EBE3" : "transparent",
                fontWeight: active ? 600 : 400, fontSize: 14,
              }}>
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}
