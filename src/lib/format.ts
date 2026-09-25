/** Shared display-formatting helpers for the re-skinned storefront (new
 * components under src/components/site). Matches the existing
 * components/storefront/theme.ts `peso()` convention exactly, so prices
 * read identically whichever design system a given page is on during the
 * page-by-page migration. */
export function formatINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** Same as formatINR, but for a PRODUCT's own price specifically (a PDP,
 * a product card, a search result, a saved item) rather than a cart/order
 * total. Some catalogue rows — most visibly the Architecture in Linen
 * capsule, seeded as DRAFT+preOrder with a ₹0 placeholder price meant to
 * be set before going live — got activated on the storefront before their
 * real price was ever entered. Showing "₹0" to a customer reads as broken
 * (or free); this reads as pending pricing instead, which is honest and
 * matches the site's own "shortlisted, not yet in production" framing.
 * Never use this for a cart subtotal/order total, where 0 can be a
 * legitimate computed value. */
export function formatPrice(n: number) {
  return n > 0 ? formatINR(n) : "Price on request";
}
