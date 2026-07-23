export const T = {
  bg: "#F8F6F3", card: "#FFFFFF", ink: "#1C1A18", mid: "#5A4A3A",
  stone: "#8A7A6A", border: "rgba(28,26,24,0.10)", linen: "#EDE8E0",
  dark: "#0D0C0B", darkCard: "#161412", darkBorder: "rgba(255,255,255,0.07)",
  gold: "#C4A96A", linenLt: "#F0EBE3",
  olive: "#33301f", borderSoft: "rgba(28,26,24,0.06)",
};
export const SERIF = "'Cormorant Garamond', Georgia, serif";
export const SANS = "'Jost', system-ui, sans-serif";
export const SIZES = ["XS", "S", "M", "L", "XL"];
export const CAT_LABEL: Record<string, string> = { ready: "Ready-to-Wear", craft: "Indian Craft", linen: "Linen" };
export const peso = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const DROP_AT = new Date("2026-08-15T18:00:00").getTime();
