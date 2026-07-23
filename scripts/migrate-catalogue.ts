// scripts/migrate-catalogue.ts
//
// One-time migration: pulls the hardcoded DL (product metadata) and IMG
// (base64 photos) arrays out of reference/App.jsx — the original polished
// storefront artifact — uploads each image to S3/local storage via
// uploadImageFromDataUrl, and creates real Product/Variant/FabricTier/
// ProductImage rows so the DB-backed storefront has something to show.
//
// Run once against a live database:
//   npx tsx scripts/migrate-catalogue.ts [path-to-source-jsx] [vendor-slug]
//
// Deliberately does NOT print any image data to stdout/logs — only ids,
// counts, and slugs — since the base64 payloads are enormous.

// `prisma db push`/`db seed` auto-load .env from either the project root or
// the prisma/ folder — running this script directly with tsx doesn't get
// that for free, so load both explicitly (whichever exists wins; harmless
// if one is missing).
import { config } from "dotenv";
config({ path: "prisma/.env" });
config();

import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { uploadImageFromDataUrl } from "../src/lib/storage";

const prisma = new PrismaClient();

type DLEntry = { pg: number; name: string; color: string; cat: string; story?: string };
type IMGMap = Record<number, string[]>;

function extractArrayLiteral(source: string, constName: string): string {
  const start = source.indexOf(`const ${constName} =`);
  if (start === -1) throw new Error(`Could not find "const ${constName} ="`);
  const openIdx = source.indexOf(constName === "DL" ? "[" : "{", start);
  const openChar = source[openIdx];
  const closeChar = openChar === "[" ? "]" : "}";
  let depth = 0;
  let inString: string | false = false;
  for (let i = openIdx; i < source.length; i++) {
    const ch = source[i];
    const prev = source[i - 1];
    if (inString) {
      if (ch === inString && prev !== "\\") inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === openChar) depth++;
    if (ch === closeChar) {
      depth--;
      if (depth === 0) return source.slice(openIdx, i + 1);
    }
  }
  throw new Error(`Unbalanced literal for ${constName}`);
}

function parseLiteral<T>(literal: string): T {
  // The DL/IMG literals are plain JS object/array literals (no imports needed) —
  // evaluate them in an isolated Function scope rather than JSON.parse, since
  // they use single quotes / unquoted keys in a few places.
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)();
}

async function main() {
  const srcPath = resolve(process.argv[2] || "reference/App.jsx");
  const vendorSlug = process.argv[3] || "jaipur-atelier";

  console.log(`Reading catalogue source from ${srcPath} ...`);
  const source = readFileSync(srcPath, "utf8");

  const dl = parseLiteral<DLEntry[]>(extractArrayLiteral(source, "DL"));
  const img = parseLiteral<IMGMap>(extractArrayLiteral(source, "IMG"));
  console.log(`Parsed ${dl.length} catalogue entries and images for ${Object.keys(img).length} of them.`);

  const vendor = await prisma.vendor.findUnique({ where: { slug: vendorSlug } });
  if (!vendor) throw new Error(`Vendor "${vendorSlug}" not found — run prisma/seed.ts first.`);

  let created = 0, skipped = 0;

  for (const item of dl) {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) { skipped++; continue; }

    const images = img[item.pg] ?? [];
    const uploadedUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const { url } = await uploadImageFromDataUrl(images[i], { filename: `${slug}-${i}.jpg`, folder: "products" });
        uploadedUrls.push(url);
      } catch (e: any) {
        console.warn(`  ! image ${i} for "${item.name}" failed to upload: ${e.message}`);
      }
    }

    await prisma.product.create({
      data: {
        slug, name: item.name, story: item.story || null, category: item.cat,
        colorHex: item.color, basePrice: 480000, status: "ACTIVE", vendorId: vendor.id,
        images: { create: uploadedUrls.map((url, i) => ({ url, position: i })) },
        variants: { create: ["XS", "S", "M", "L", "XL"].map((size) => ({ size, sku: `${slug}-${size}`, stock: 6 })) },
        tiers: { create: [
          { label: "Signature linen", priceAdd: 0, position: 0 },
          { label: "Premium handloom", priceAdd: 150000, position: 1 },
          { label: "Hand-embroidered couture", priceAdd: 350000, position: 2 },
        ] },
      },
    });
    created++;
    console.log(`  + ${slug} (${uploadedUrls.length} images)`);
  }

  console.log(`Done. Created ${created} products, skipped ${skipped} already-existing.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
