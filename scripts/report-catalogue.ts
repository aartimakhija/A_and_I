// scripts/report-catalogue.ts
//
// Read-only. Prints exactly what's in the Product table right now, split
// into the legacy catalogue (everything migrated by migrate-catalogue.ts /
// prisma/seed.ts) vs the new "Architecture in Linen" capsule (vendor slug
// "tbd-architecture-in-linen", from prisma/seed-architecture-in-linen.ts).
// For each legacy product it also flags whether real business records
// (orders, purchase-order lines) exist against it, since those cannot be
// safely deleted.
//
// Run:  npx tsx scripts/report-catalogue.ts

import { config } from "dotenv";
config({ path: "prisma/.env" });
config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CAPSULE_VENDOR_SLUG = "tbd-architecture-in-linen";

async function main() {
  const total = await prisma.product.count();
  console.log(`TOTAL PRODUCTS: ${total}\n`);

  const byGroup = await prisma.product.groupBy({
    by: ["category", "status"],
    _count: { _all: true },
    orderBy: [{ category: "asc" }, { status: "asc" }],
  });
  console.log("BY CATEGORY / STATUS:");
  for (const row of byGroup) console.log(`  ${row.category} / ${row.status}: ${row._count._all}`);

  const capsuleVendor = await prisma.vendor.findUnique({ where: { slug: CAPSULE_VENDOR_SLUG } });

  const products = await prisma.product.findMany({
    include: {
      vendor: { select: { name: true, slug: true } },
      _count: { select: { orderItems: true, poItems: true, reviews: true, wishlist: true, preOrders: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const capsule = capsuleVendor ? products.filter((p) => p.vendorId === capsuleVendor.id) : [];
  const legacy = capsuleVendor ? products.filter((p) => p.vendorId !== capsuleVendor.id) : products;

  console.log(`\nARCHITECTURE IN LINEN CAPSULE (vendor "${CAPSULE_VENDOR_SLUG}"): ${capsule.length} product(s)`);

  console.log(`\nLEGACY / PRE-EXISTING CATALOGUE (everything else): ${legacy.length} product(s)`);
  let blocked = 0;
  for (const p of legacy) {
    const hasOrders = p._count.orderItems > 0 || p._count.poItems > 0;
    if (hasOrders) blocked++;
    const flag = hasOrders ? "  ⚠ HAS ORDER/PO HISTORY — cannot be hard-deleted" : "";
    console.log(
      `  [${p.category}/${p.status}] ${p.slug} — "${p.name}" — vendor: ${p.vendor.name} (${p.vendor.slug}) — ` +
        `orders:${p._count.orderItems} poItems:${p._count.poItems} reviews:${p._count.reviews} wishlist:${p._count.wishlist} preOrders:${p._count.preOrders}` +
        flag,
    );
  }
  console.log(
    `\n${legacy.length} legacy product(s) found; ${blocked} of them have real order/PO history and would be skipped by ` +
      `scripts/cleanup-legacy-catalogue.ts (archived instead of deleted). ${legacy.length - blocked} are safe to hard-delete.`,
  );
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
