import { prisma } from "@/lib/prisma";

/**
 * Returns all categories (active by default). On first call, if no
 * Category rows exist yet, seeds them from whatever category values are
 * actually in use on real products — so turning on this configurable
 * system never silently hides part of an existing catalogue. Admins can
 * then rename, reorder, deactivate, or delete from Admin → Categories.
 */
export async function getCategories(includeInactive = false) {
  const count = await prisma.category.count();
  if (count === 0) {
    const distinct = await prisma.product.findMany({ distinct: ["category"], select: { category: true } });
    const seed = distinct.length > 0
      ? distinct.map((d, i) => ({ name: titleCase(d.category), slug: d.category, position: i }))
      : [{ name: "Indian Craft", slug: "craft", position: 0 }, { name: "Linen", slug: "linen", position: 1 }];
    await prisma.category.createMany({ data: seed, skipDuplicates: true });
  }
  return prisma.category.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { position: "asc" },
  });
}

function titleCase(slug: string) {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
