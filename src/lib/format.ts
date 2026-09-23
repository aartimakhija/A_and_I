/** Shared display-formatting helpers for the re-skinned storefront (new
 * components under src/components/site). Matches the existing
 * components/storefront/theme.ts `peso()` convention exactly, so prices
 * read identically whichever design system a given page is on during the
 * page-by-page migration. */
export function formatINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
