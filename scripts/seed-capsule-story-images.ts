// scripts/seed-capsule-story-images.ts
//
// Sets the 5 "story" imagery fields (sketchImageUrl, paletteImageUrl,
// makingImageUrl, fabricImageUrl, careImageUrl) on each of the 40
// "Architecture in Linen" capsule products, pointing at the dedicated
// story photography uploaded alongside the front/back/left/right shots
// (same position-based look-NN mapping as scripts/seed-capsule-images.ts).
//
// These fields power the storytelling sections of ProductStory.tsx
// ("From line to palette", "Then, the making begins", "The cloth, up
// close", the care/steaming inset) instead of falling back to cycling
// through the plain catalogue photos.
//
// Usage:
//   npm run seed:capsule-story-images              # dry run — prints what would change
//   npm run seed:capsule-story-images -- --confirm # actually writes the Product rows
//
// Safe to re-run: it's a plain update of 5 scalar fields per product, so
// running it again just re-sets the same URLs.

import { config } from "dotenv";
config({ path: "prisma/.env" });
config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CAPSULE_IMAGES: { slug: string; name: string; ts: string }[] = [
  { slug: "architecture-in-linen-look-01-asymmetric-one-shoulder-girih-cutwork-gown", name: "Asymmetric One-Shoulder Girih Cutwork Gown", ts: "1790000000000" },
  { slug: "architecture-in-linen-look-02-sculptural-halterneck-girih-backless-midi-dress", name: "Sculptural Halterneck Girih Backless Midi Dress", ts: "1790000000001" },
  { slug: "architecture-in-linen-look-06-sculptural-wide-leg-girih-linen-jumpsuit", name: "Sculptural Wide-Leg Girih Linen Jumpsuit", ts: "1790000000002" },
  { slug: "architecture-in-linen-look-08-asymmetric-capelet-playsuit", name: "Asymmetric Capelet Playsuit", ts: "1790000000003" },
  { slug: "architecture-in-linen-look-11-boxy-cropped-girih-shirt-high-waisted-shorts-co-ord", name: "Boxy Cropped Girih Shirt & High-Waisted Pleated Shorts", ts: "1790000000004" },
  { slug: "architecture-in-linen-look-12-asymmetric-wrap-vest-and-sculpted-short-set", name: "Asymmetric Wrap Vest and Sculpted Short Set", ts: "1790000000005" },
  { slug: "architecture-in-linen-look-16-asymmetric-tunic-and-monumental-palazzo-pants-co-ord", name: "Asymmetric Tunic and Monumental Palazzo Pants", ts: "1790000000006" },
  { slug: "architecture-in-linen-look-17-architectural-corset-top-and-pleated-wide-leg-trousers-co-or", name: "Architectural Corset Top and Pleated Wide-Leg Trousers", ts: "1790000000007" },
  { slug: "architecture-in-linen-look-20-oversized-safari-blouse-and-slit-ankle-fluid-pants-co-ord", name: "Oversized Safari Blouse and Slit-Ankle Fluid Pants", ts: "1790000000008" },
  { slug: "architecture-in-linen-look-22-backless-halter-column-jumpsuit-with-pointed-arch-cutouts", name: "Backless Halter Column Jumpsuit with Pointed Arch Cutouts", ts: "1790000000009" },
  { slug: "architecture-in-linen-look-23-sculptural-safari-cropped-jacket-and-cargo-shorts-co-ord", name: "Sculptural Safari Cropped Jacket and Cargo Shorts", ts: "1790000000010" },
  { slug: "architecture-in-linen-look-24-one-shoulder-draped-tunic-and-fluid-linen-palazzos-co-ord", name: "One-Shoulder Draped Tunic and Fluid Linen Palazzos", ts: "1790000000011" },
  { slug: "architecture-in-linen-look-37-architectural-asymmetric-waistcoat-tailored-shorts-co-ord", name: "Architectural Asymmetric Waistcoat & Tailored Shorts", ts: "1790000000012" },
  { slug: "architecture-in-linen-look-129-voronoi-cell-cutwork-slip-dress", name: "Voronoi Cell Cutwork Slip Dress", ts: "1790000000013" },
  { slug: "architecture-in-linen-look-133-obsidian-silk-co-ord-set", name: "Obsidian Silk Co-ord Set", ts: "1790000000014" },
  { slug: "architecture-in-linen-look-134-champagne-organza-romper", name: "Champagne Organza Romper", ts: "1790000000015" },
  { slug: "architecture-in-linen-look-143-ivory-linen-silk-romper", name: "Ivory Linen Silk Romper", ts: "1790000000016" },
  { slug: "architecture-in-linen-look-05-deep-v-keyhole-girih-wrap-gown", name: "Deep-V Keyhole Girih Wrap Gown", ts: "1790000000017" },
  { slug: "architecture-in-linen-look-38-draped-waterfall-wrap-blouse-tiered-palazzo-co-ord", name: "Draped Waterfall Wrap Blouse & Tiered Palazzo", ts: "1790000000018" },
  { slug: "architecture-in-linen-look-42-striped-panel-lasercut-jumpsuit", name: "Striped Panel Lasercut Jumpsuit", ts: "1790000000019" },
  { slug: "architecture-in-linen-look-50-striped-corset-top-palazzo-co-ord", name: "Striped Corset Top & Palazzo Co-ord", ts: "1790000000020" },
  { slug: "architecture-in-linen-look-57-rose-line-print-lasercut-slip-gown", name: "Rose Line-Print Lasercut Slip Gown", ts: "1790000000021" },
  { slug: "architecture-in-linen-look-63-lilac-stripe-oversized-blazer-wide-palazzo-suit", name: "Lilac Stripe Oversized Blazer & Wide Palazzo Suit", ts: "1790000000022" },
  { slug: "architecture-in-linen-look-64-peach-line-print-cropped-blazer-slit-skirt-co-ord", name: "Peach Line-Print Cropped Blazer & Slit Skirt", ts: "1790000000023" },
  { slug: "architecture-in-linen-look-68-pistachio-stripe-cape-sleeve-blazer-palazzo-co-ord", name: "Pistachio Stripe Cape-Sleeve Blazer & Palazzo", ts: "1790000000024" },
  { slug: "architecture-in-linen-look-69-lavender-line-print-tuxedo-blazer-jumpsuit", name: "Lavender Line-Print Tuxedo Blazer Jumpsuit", ts: "1790000000025" },
  { slug: "architecture-in-linen-look-71-cobalt-stripe-lasercut-blazer-shorts", name: "Cobalt Stripe Lasercut Blazer & Shorts", ts: "1790000000026" },
  { slug: "architecture-in-linen-look-72-marigold-line-print-blazer-dress", name: "Marigold Line-Print Blazer Dress", ts: "1790000000027" },
  { slug: "architecture-in-linen-look-74-fuchsia-line-print-cropped-blazer-slit-skirt", name: "Fuchsia Line-Print Cropped Blazer & Slit Skirt", ts: "1790000000028" },
  { slug: "architecture-in-linen-look-79-tangerine-line-print-cape-sleeve-blazer-high-rise-shorts", name: "Tangerine Line-Print Cape-Sleeve Blazer & High-Rise Shorts", ts: "1790000000029" },
  { slug: "architecture-in-linen-look-92-ombr-lasercut-density-jumpsuit-in-cobalt-sky", name: "Ombre Lasercut Density Jumpsuit in Cobalt Sky", ts: "1790000000030" },
  { slug: "architecture-in-linen-look-101-girih-cutwork-vest-sarong-skirt", name: "Girih Cutwork Vest & Sarong Skirt", ts: "1790000000031" },
  { slug: "architecture-in-linen-look-104-halter-girih-gown-with-train", name: "Halter Girih Gown with Train", ts: "1790000000032" },
  { slug: "architecture-in-linen-look-109-girih-cutwork-shirt-palazzo-set", name: "Girih Cutwork Shirt & Palazzo Set", ts: "1790000000033" },
  { slug: "architecture-in-linen-look-111-girih-cutwork-evening-gown", name: "Girih Cutwork Evening Gown", ts: "1790000000034" },
  { slug: "architecture-in-linen-look-120-nouveau-vine-cutwork-gown", name: "Nouveau Vine Cutwork Gown", ts: "1790000000035" },
  { slug: "architecture-in-linen-look-121-moorish-muqarnas-cutwork-caftan", name: "Moorish Muqarnas Cutwork Caftan", ts: "1790000000036" },
  { slug: "architecture-in-linen-look-123-bauhaus-grid-cutwork-jumpsuit", name: "Bauhaus Grid Cutwork Jumpsuit", ts: "1790000000037" },
  { slug: "architecture-in-linen-look-157-linen-waistcoat-palazzo-set", name: "Linen Waistcoat & Palazzo Set", ts: "1790000000038" },
  { slug: "architecture-in-linen-look-185-girih-cutwork-ombr-wrap-sweater", name: "Girih Cutwork Ombre Wrap Sweater", ts: "1790000000039" },
];

const STORY_SUFFIXES = ["sketch", "palette", "making", "fabric", "care"] as const;

async function main() {
  const confirm = process.argv.includes("--confirm");
  console.log(`Mode: ${confirm ? "CONFIRM (writing)" : "DRY RUN (no writes)"}`);
  console.log(`Products to update: ${CAPSULE_IMAGES.length}\n`);

  let updated = 0;
  let missing = 0;

  for (const row of CAPSULE_IMAGES) {
    const product = await prisma.product.findUnique({
      where: { slug: row.slug },
      select: { id: true, name: true },
    });

    if (!product) {
      console.log(`  ⚠️  NOT FOUND in DB: ${row.slug}`);
      missing++;
      continue;
    }

    const urls = Object.fromEntries(
      STORY_SUFFIXES.map((suffix) => [suffix, `/uploads/products/${row.ts}-${row.slug}-${suffix}.jpg`])
    ) as Record<(typeof STORY_SUFFIXES)[number], string>;

    console.log(`  ${product.name} (${row.slug})`);

    if (confirm) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          sketchImageUrl: urls.sketch,
          paletteImageUrl: urls.palette,
          makingImageUrl: urls.making,
          fabricImageUrl: urls.fabric,
          careImageUrl: urls.care,
        },
      });
    }

    updated++;
  }

  console.log(`\n${confirm ? "Updated" : "Would update"} ${updated} product(s).`);
  if (missing > 0) console.log(`${missing} slug(s) from the mapping were not found in the DB — check for drift.`);
  if (!confirm) console.log("Re-run with --confirm to write these changes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
