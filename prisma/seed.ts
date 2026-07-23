import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("password123", 10);

  // Admin
  await prisma.user.upsert({
    where: { email: "admin@aandi.com" }, update: {},
    create: { email: "admin@aandi.com", name: "A & I Admin", role: Role.ADMIN, passwordHash: pass },
  });

  // Vendor + vendor login (scoped)
  const vendor = await prisma.vendor.upsert({
    where: { slug: "jaipur-atelier" }, update: {},
    create: { name: "Jaipur Atelier", slug: "jaipur-atelier", email: "studio@jaipur.in", status: "APPROVED", commission: 0.18, moq: 5 },
  });
  await prisma.user.upsert({
    where: { email: "vendor@jaipur.in" }, update: {},
    create: { email: "vendor@jaipur.in", name: "Jaipur Atelier", role: Role.VENDOR, vendorId: vendor.id, passwordHash: pass },
  });

  // A second vendor to prove isolation
  const vendor2 = await prisma.vendor.upsert({
    where: { slug: "kutch-craft" }, update: {},
    create: { name: "Kutch Craft Co.", slug: "kutch-craft", email: "hello@kutch.in", status: "APPROVED" },
  });
  await prisma.user.upsert({
    where: { email: "vendor@kutch.in" }, update: {},
    create: { email: "vendor@kutch.in", name: "Kutch Craft", role: Role.VENDOR, vendorId: vendor2.id, passwordHash: pass },
  });

  // Sample products (port the full 40 from the artifact DL here)
  const sample = [
    { slug: "empress-in-green", name: "Empress in Green", category: "craft", colorHex: "#1f4d2e", colorName: "Emerald", vendorId: vendor.id },
    { slug: "gold-hour", name: "Gold Hour", category: "ready", colorHex: "#c9a14a", colorName: "Gold", vendorId: vendor.id },
    { slug: "amber-and-mirrors", name: "Amber & Mirrors", category: "craft", colorHex: "#b5651d", colorName: "Amber", vendorId: vendor2.id },
    { slug: "azure-escape", name: "Azure Escape", category: "linen", colorHex: "#4a7ba6", colorName: "Azure", vendorId: vendor2.id },
  ];
  for (const p of sample) {
    await prisma.product.upsert({
      where: { slug: p.slug }, update: {},
      create: {
        ...p, basePrice: 480000, story: "Indian craft, global silhouette.",
        variants: { create: ["XS", "S", "M", "L", "XL"].map((size) => ({ size, sku: `${p.slug}-${size}`, stock: 6 })) },
        tiers: { create: [
          { label: "Signature linen", priceAdd: 0, position: 0 },
          { label: "Premium handloom", priceAdd: 150000, position: 1 },
          { label: "Hand-embroidered couture", priceAdd: 350000, position: 2 },
        ] },
      },
    });
  }
  console.log("Seeded. Logins (password123): admin@aandi.com · vendor@jaipur.in · vendor@kutch.in");
}
main().finally(() => prisma.$disconnect());
