import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

type Hit = { type: string; label: string; sublabel?: string; href: string };

export async function GET(req: NextRequest) {
  await requireRole(["ADMIN"]);
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ hits: [] });

  const [products, orders, vendors, materials, pos, materialOrders, posts, preorders] = await Promise.all([
    prisma.product.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true, category: true }, take: 5 }),
    prisma.order.findMany({ where: { OR: [{ number: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }, select: { id: true, number: true, email: true }, take: 5 }),
    prisma.vendor.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true }, take: 5 }),
    prisma.material.findMany({ where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] }, select: { id: true, name: true, sku: true }, take: 5 }),
    prisma.purchaseOrder.findMany({ where: { poNumber: { contains: q, mode: "insensitive" } }, select: { id: true, poNumber: true, status: true }, take: 5 }),
    prisma.materialOrder.findMany({ where: { orderNumber: { contains: q, mode: "insensitive" } }, select: { id: true, orderNumber: true, status: true }, take: 5 }),
    prisma.blogPost.findMany({ where: { title: { contains: q, mode: "insensitive" } }, select: { id: true, title: true, status: true }, take: 5 }),
    prisma.preOrder.findMany({ where: { OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] }, select: { id: true, name: true, email: true }, take: 5 }),
  ]);

  const hits: Hit[] = [
    ...products.map((p) => ({ type: "Product", label: p.name, sublabel: p.category, href: `/admin/products/${p.id}/edit` })),
    ...orders.map((o) => ({ type: "Order", label: o.number, sublabel: o.email, href: `/admin/orders` })),
    ...vendors.map((v) => ({ type: "Vendor", label: v.name, href: `/admin/vendors` })),
    ...materials.map((m) => ({ type: "Material", label: m.name, sublabel: m.sku, href: `/admin/materials` })),
    ...pos.map((p) => ({ type: "Production Order", label: p.poNumber, sublabel: p.status, href: `/admin/purchase-orders/${p.id}` })),
    ...materialOrders.map((m) => ({ type: "Material Order", label: m.orderNumber, sublabel: m.status, href: `/admin/material-orders/${m.id}` })),
    ...posts.map((p) => ({ type: "Journal", label: p.title, sublabel: p.status, href: `/admin/blog/${p.id}/edit` })),
    ...preorders.map((p) => ({ type: "Pre-order lead", label: p.name || p.email, sublabel: p.name ? p.email : undefined, href: `/admin/preorders` })),
  ];

  return NextResponse.json({ hits });
}
