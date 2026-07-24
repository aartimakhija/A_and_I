// scripts/set-all-preorder.ts
//
// Sets preOrder=true (or false, with --off) on every active product in one
// pass — for when the business-wide status changes rather than a one-off
// product. For everyday use, prefer the "Enable pre-order" bulk action in
// Admin → Catalogue instead; this script is for exactly this kind of
// whole-catalogue flip.
//
// Run:  npx tsx scripts/set-all-preorder.ts          (turns pre-order ON for all)
//       npx tsx scripts/set-all-preorder.ts --off     (turns it back OFF for all)

import { config } from "dotenv";
config({ path: "prisma/.env" });
config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const turnOff = process.argv.includes("--off");
  const result = await prisma.product.updateMany({
    where: { status: "ACTIVE" },
    data: { preOrder: !turnOff },
  });
  console.log(`Set preOrder=${!turnOff} on ${result.count} active product(s).`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
