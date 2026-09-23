// scripts/cleanup-legacy-catalogue.ts
//
// Removes the legacy / pre-existing catalogue (everything migrated by
// migrate-catalogue.ts and prisma/seed.ts) now that it's being replaced by
// the "Architecture in Linen" capsule (vendor slug "tbd-architecture-in-linen",
// seeded by prisma/seed-architecture-in-linen.ts). Never touches capsule
// products.
//
// By default, a product with real order or purchase-order history is
// ARCHIVED instead of deleted, so past orders/analytics/passports stay
// intact. Pass --force to hard-delete those too:
//   - a product referenced by OrderItem(s): the whole Order(s) it belongs
//     to are deleted first (cascades to OrderItem/Payment/Shipment/Return/
//     Passport per schema.prisma), THEN the product.
//   - a product referenced by PurchaseOrderItem(s): the PO line's productId
//     is set to null first (the PO/line itself is kept, just unlinked from
//     the deleted product), THEN the product is deleted.
// --force is destructive and cannot be undone. Use it only when you're sure
// you don't need those orders/PO lines anymore.
//
// DRY RUN BY DEFAULT — prints exactly what it would do and changes nothing.
// Run:                    npx tsx scripts/cleanup-legacy-catalogue.ts
// Archive-safe apply:     npx tsx scripts/cleanup-legacy-catalogue.ts --confirm
// Force-delete everything: npx tsx scripts/cleanup-legacy-catalogue.ts --confirm --force

import { config } from "dotenv";
config({ path: "prisma/.env" });
config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CAPSULE_VENDOR_SLUG = "tbd-architecture-in-linen";

async function main() {
  const confirm = process.argv.includes("--confirm");
  const force = process.argv.includes("--force");

  const capsuleVendor = await prisma.vendor.findUnique({ where: { slug: CAPSULE_VENDOR_SLUG } });

  const legacy = await prisma.product.findMany({
    where: capsuleVendor ? { vendorId: { not: capsuleVendor.id } } : {},
    include: {
      vendor: { select: { name: true, slug: true } },
      _count: { select: { orderItems: true, poItems: true } },
      orderItems: { select: { orderId: true, order: { select: { number: true } } } },
      poItems: { select: { id: true, poId: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (legacy.length === 0) {
    console.log("No legacy products found — nothing to do.");
    return;
  }

  const hasHistory = (p: (typeof legacy)[number]) => p._count.orderItems > 0 || p._count.poItems > 0;
  const clean = legacy.filter((p) => !hasHistory(p));
  const withHistory = legacy.filter(hasHistory);

  console.log(`Found ${legacy.length} legacy product(s):`);
  console.log(`  ${clean.length} with no order/PO history -> ${confirm ? "DELETING" : "would be DELETED"}`);
  console.log(
    `  ${withHistory.length} with real order/PO history -> ${
      !confirm ? "would be ARCHIVED, not deleted" : force ? "FORCE-DELETING (and their orders/PO links)" : "ARCHIVING (status=ARCHIVED)"
    }`,
  );
  console.log("");

  for (const p of clean) console.log(`  DELETE  [${p.category}] ${p.slug} — "${p.name}" (vendor: ${p.vendor.name})`);
  for (const p of withHistory) {
    const orderNumbers = Array.from(new Set(p.orderItems.map((oi) => oi.order.number)));
    const label = confirm && force ? "FORCE-DELETE" : "ARCHIVE";
    console.log(
      `  ${label} [${p.category}] ${p.slug} — "${p.name}" (vendor: ${p.vendor.name}) — ` +
        `orders:${p._count.orderItems}${orderNumbers.length ? ` (${orderNumbers.join(", ")})` : ""} poItems:${p._count.poItems}`,
    );
  }

  if (!confirm) {
    console.log("\nDry run only — no changes made. Re-run with --confirm to apply (add --force to also delete order/PO-linked products).");
    return;
  }

  let deleted = 0;
  for (const p of clean) {
    // Cascades to ProductImage, Variant, FabricTier, Review, Wishlist,
    // NotifyRequest, PreOrder, BlogPostProduct, ProductMaterial per schema.prisma.
    await prisma.product.delete({ where: { id: p.id } });
    deleted++;
  }

  if (!force) {
    const archivedResult = await prisma.product.updateMany({
      where: { id: { in: withHistory.map((p) => p.id) } },
      data: { status: "ARCHIVED" },
    });
    console.log(`\nDone. Deleted ${deleted} product(s). Archived ${archivedResult.count} product(s) with order/PO history.`);
    return;
  }

  let forceDeleted = 0;
  const deletedOrders: string[] = [];
  for (const p of withHistory) {
    const orderIds = Array.from(new Set(p.orderItems.map((oi) => oi.orderId)));
    for (const orderId of orderIds) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, select: { number: true } });
      // Cascades to OrderItem -> Passport, Payment, Shipment, Return per schema.prisma.
      await prisma.order.delete({ where: { id: orderId } });
      if (order) deletedOrders.push(order.number);
    }
    if (p.poItems.length > 0) {
      await prisma.purchaseOrderItem.updateMany({
        where: { id: { in: p.poItems.map((i) => i.id) } },
        data: { productId: null },
      });
    }
    await prisma.product.delete({ where: { id: p.id } });
    forceDeleted++;
  }

  console.log(
    `\nDone. Deleted ${deleted} product(s) with no history, plus force-deleted ${forceDeleted} product(s) with history.\n` +
      `Also deleted ${deletedOrders.length} order(s) entirely: ${deletedOrders.join(", ") || "(none)"}.\n` +
      `Detached (set to null) any purchase-order-item links to the force-deleted products.`,
  );
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
