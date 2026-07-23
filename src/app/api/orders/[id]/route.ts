import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { trackingUrlFor } from "@/lib/shipping";
import { sendWhatsApp } from "@/lib/integrations";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payment: true, shipment: { include: { events: true } }, returns: true },
  });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(order);
}

// Update order status and/or shipment (carrier, tracking number, delivery status).
// This is the admin "update order status" form's endpoint — the OMS write path
// that was previously missing (admin pages were read-only).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await requireRole(["ADMIN"]);
  const b = await req.json();
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { shipment: true } });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });

  // 1) Order-level status transition (OMS)
  if (b.status) {
    await prisma.order.update({ where: { id: order.id }, data: { status: b.status } });
  }

  // 2) Shipment / delivery fields — upsert so the first "mark shipped" creates the record
  if (b.carrier !== undefined || b.trackingNumber !== undefined || b.shipmentStatus) {
    const trackingUrl = b.trackingNumber ? trackingUrlFor(b.carrier, b.trackingNumber) : null;
    const shipment = await prisma.shipment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        carrier: b.carrier ?? null,
        trackingNumber: b.trackingNumber ?? null,
        trackingUrl,
        status: b.shipmentStatus ?? "LABEL_CREATED",
        shippedAt: b.shipmentStatus && b.shipmentStatus !== "LABEL_CREATED" ? new Date() : null,
        deliveredAt: b.shipmentStatus === "DELIVERED" ? new Date() : null,
      },
      update: {
        ...(b.carrier !== undefined ? { carrier: b.carrier } : {}),
        ...(b.trackingNumber !== undefined ? { trackingNumber: b.trackingNumber, trackingUrl } : {}),
        ...(b.shipmentStatus ? { status: b.shipmentStatus } : {}),
        ...(b.shipmentStatus === "DELIVERED" ? { deliveredAt: new Date() } : {}),
        ...(b.shipmentStatus && b.shipmentStatus !== "LABEL_CREATED" && !order.shipment?.shippedAt ? { shippedAt: new Date() } : {}),
      },
    });
    if (b.shipmentStatus) {
      await prisma.shipmentEvent.create({ data: { shipmentId: shipment.id, status: b.shipmentStatus, note: b.note ?? null } });
    }
    // keep the order's own status in sync with shipment milestones unless the caller set it explicitly
    if (!b.status && b.shipmentStatus === "DELIVERED") await prisma.order.update({ where: { id: order.id }, data: { status: "DELIVERED" } });
    if (!b.status && b.shipmentStatus && b.shipmentStatus !== "LABEL_CREATED" && order.status === "FULFILLING") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "SHIPPED" } });
    }
    if (order.shipPhone && b.trackingNumber) {
      await sendWhatsApp(order.shipPhone, "order_shipped", [order.number, b.trackingNumber]);
    }
  }

  const updated = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true, payment: true, shipment: true } });
  return NextResponse.json(updated);
}
