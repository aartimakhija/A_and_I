// Bridges the DB (Prisma Product + relations) to the shape the ported storefront
// UI components expect. This is the seam the README asked for: "swap the
// hard-coded DL/IMG arrays for DB calls" — everything downstream of this file
// only ever sees SFProduct, never Prisma types directly.

export type SFProduct = {
  id: string;
  slug: string;
  name: string;
  story: string | null;
  category: string;
  color: string;
  colorName: string | null;
  price: number; // rupees, for display — DB stores paise
  images: string[];
  variants: { size: string; stock: number }[];
  tiers: { label: string; priceAdd: number }[]; // priceAdd in rupees
  status: string;
};

type PrismaProductWithRelations = {
  id: string; slug: string; name: string; story: string | null; category: string;
  colorHex: string; colorName: string | null; basePrice: number; status: string;
  images: { url: string; position: number }[];
  variants: { size: string; stock: number }[];
  tiers: { label: string; priceAdd: number; position: number }[];
};

export function toSFProduct(p: PrismaProductWithRelations): SFProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    story: p.story,
    category: p.category,
    color: p.colorHex,
    colorName: p.colorName,
    price: p.basePrice / 100,
    images: [...p.images].sort((a, b) => a.position - b.position).map((i) => i.url),
    variants: p.variants,
    tiers: [...p.tiers].sort((a, b) => a.position - b.position).map((t) => ({ label: t.label, priceAdd: t.priceAdd / 100 })),
    status: p.status,
  };
}

export const PRODUCT_INCLUDE = { images: true, variants: true, tiers: true } as const;
