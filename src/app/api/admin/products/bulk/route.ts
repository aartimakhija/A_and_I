import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, vendorScope } from "@/lib/rbac";
import { csvToObjects } from "@/lib/csv";
import { getCategories } from "@/lib/categories";

const SIZES = ["XS", "S", "M", "L", "XL"];

// Expected CSV columns:
//   name, slug (optional — derived from name if blank), category (any active category slug — see Admin → Categories),
//   colorHex, colorName (optional), story (optional), basePrice (rupees),
//   stock (applied to every size), vendorSlug (admin only — vendors are locked to themselves),
//   status (optional, defaults ACTIVE), imageUrls (optional, semicolon-separated)
export async function POST(req: NextRequest) {
  const s = await requireRole(["ADMIN", "VENDOR"]);
  const { csv } = await req.json();
  if (typeof csv !== "string" || !csv.trim()) {
    return NextResponse.json({ error: "No CSV content received" }, { status: 400 });
  }

  const rows = csvToObjects(csv);
  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV has no data rows (check it has a header row plus at least one product)" }, { status: 400 });
  }

  const [vendors, categories] = await Promise.all([
    prisma.vendor.findMany({ where: vendorScope(s, "id") as any, select: { id: true, slug: true } }),
    getCategories(),
  ]);
  const vendorBySlug = Object.fromEntries(vendors.map((v) => [v.slug, v.id]));
  const validCategorySlugs = categories.map((c) => c.slug);
  const defaultVendorId = s.role === "VENDOR" ? s.vendorId! : undefined;

  let created = 0, skipped = 0;
  const errors: { row: number; message: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const line = i + 2; // +1 for header row, +1 for 1-indexing
    try {
      if (!r.name) { errors.push({ row: line, message: "Missing name" }); continue; }
      if (!r.category || !validCategorySlugs.includes(r.category)) {
        errors.push({ row: line, message: `Category must be one of: ${validCategorySlugs.join(", ")} (got "${r.category}") — manage these under Admin → Categories` }); continue;
      }
      const slug = (r.slug || r.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) { skipped++; continue; }

      const vendorId = defaultVendorId || vendorBySlug[r.vendorSlug];
      if (!vendorId) { errors.push({ row: line, message: `Unknown vendorSlug "${r.vendorSlug}"` }); continue; }

      const basePrice = Math.round(parseFloat(r.basePrice || "4800") * 100);
      const stock = parseInt(r.stock || "6", 10);
      const imageUrls = (r.imageUrls || "").split(";").map((u) => u.trim()).filter(Boolean);

      await prisma.product.create({
        data: {
          slug, name: r.name, story: r.story || null, category: r.category,
          colorHex: r.colorHex || "#8A7A6A", colorName: r.colorName || null,
          basePrice, status: (r.status as any) || "ACTIVE", vendorId,
          featured: r.featured === "true" || r.featured === "1",
          featuredOrder: parseInt(r.featuredOrder || "0", 10),
          lookbookOrder: r.lookbookOrder ? parseInt(r.lookbookOrder, 10) : null,
          variants: { create: SIZES.map((size) => ({ size, sku: `${slug}-${size}`, stock })) },
          tiers: { create: [
            { label: "Signature linen", priceAdd: 0, position: 0 },
            { label: "Premium handloom", priceAdd: 150000, position: 1 },
            { label: "Hand-embroidered couture", priceAdd: 350000, position: 2 },
          ] },
          images: { create: imageUrls.map((url, idx) => ({ url, position: idx })) },
        },
      });
      created++;
    } catch (e: any) {
      errors.push({ row: line, message: e?.message || "Unknown error" });
    }
  }

  return NextResponse.json({ created, skipped, errors });
}
