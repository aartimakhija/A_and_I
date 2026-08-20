import type { SFProduct } from "@/lib/storefront-adapter";

export type AvailabilityStatus = "PRE_ORDER" | "IN_STOCK" | "LOW_STOCK" | "SOLD_OUT";

export type Availability = {
  status: AvailabilityStatus;
  label: string;          // what the badge/status line shows
  canAddToBag: boolean;   // true only for IN_STOCK / LOW_STOCK
  totalStock: number;
};

/**
 * The one place that decides whether a product is buyable right now, and
 * what to call that state. ProductCard (grid) and Product (PDP) both call
 * this and nothing else — so a grid badge and a PDP status line can never
 * disagree again, which was the single highest-leverage bug the design
 * audit found: a product badged "Ready to Ship" in the grid whose own PDP
 * said "Pre-order — not yet in production."
 */
export function getAvailability(product: Pick<SFProduct, "preOrder" | "variants" | "status">): Availability {
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  if (product.preOrder) {
    return { status: "PRE_ORDER", label: "Pre-order", canAddToBag: false, totalStock };
  }
  if (product.status === "SOLD_OUT" || totalStock === 0) {
    return { status: "SOLD_OUT", label: "Sold out", canAddToBag: false, totalStock };
  }
  if (totalStock <= 5) {
    return { status: "LOW_STOCK", label: `Only ${totalStock} left`, canAddToBag: true, totalStock };
  }
  return { status: "IN_STOCK", label: "Ready to ship", canAddToBag: true, totalStock };
}
