// A deliberately simple, fully static styling engine — no LLM, no API key,
// no network round-trip. Replaces the earlier Anthropic-backed stylist with
// plain rules over data we already have: category, colorHex, and story text.
// Trades "understands anything you type" for "instant, free, and impossible
// to break" — the right trade for a lean v1.

export type Occasion = { id: string; label: string; categories: string[]; keywords: string[] };
export type Vibe = { id: string; label: string };

export const OCCASIONS: Occasion[] = [
  { id: "wedding", label: "Wedding · Sangeet", categories: ["craft"], keywords: ["sangeet", "wedding", "reception", "festive", "bridal"] },
  { id: "brunch", label: "Brunch · Casual day", categories: ["ready", "linen"], keywords: ["brunch", "casual", "day", "everyday"] },
  { id: "datenight", label: "Date night · Cocktails", categories: ["craft", "ready"], keywords: ["cocktail", "date", "evening", "night"] },
  { id: "resort", label: "Resort · Destination", categories: ["linen", "ready"], keywords: ["resort", "travel", "vacation", "destination", "linen"] },
  { id: "work", label: "Workwear · Meetings", categories: ["ready", "linen"], keywords: ["work", "office", "meeting", "tailored"] },
];

export const VIBES: Vibe[] = [
  { id: "bold", label: "Bold & bright" },
  { id: "classic", label: "Classic & earthy" },
  { id: "minimal", label: "Minimal & neutral" },
  { id: "playful", label: "Playful & pretty" },
];

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d > 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function vibeScore(vibeId: string, colorHex: string): number {
  let hsl;
  try { hsl = hexToHsl(colorHex); } catch { return 0; }
  const { h, s, l } = hsl;
  switch (vibeId) {
    case "minimal": return (l > 80 || s < 15) ? 2 : 0;
    case "classic": return (h >= 25 && h <= 55 && s > 15 && s < 65) ? 2 : (l < 40 ? 1 : 0);
    case "playful": return ((h >= 290 && h <= 350) || (h >= 0 && h <= 20 && s > 40)) ? 2 : 0;
    case "bold": return (s > 55 && l > 30 && l < 75) ? 2 : 0;
    default: return 0;
  }
}

export type StylistProduct = { id: string; slug: string; name: string; category: string; colorHex: string; story: string | null };

export function styleMatch(occasionId: string, vibeId: string, catalogue: StylistProduct[]) {
  const occasion = OCCASIONS.find((o) => o.id === occasionId);
  if (!occasion) return { blurb: "Pick an occasion to get started.", picks: [] };

  const scored = catalogue.map((p) => {
    let score = 0;
    if (occasion.categories.includes(p.category)) score += 3;
    const text = `${p.name} ${p.story ?? ""}`.toLowerCase();
    if (occasion.keywords.some((k) => text.includes(k))) score += 2;
    score += vibeScore(vibeId, p.colorHex);
    return { p, score };
  });

  const picks = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((s) => s.p);
  const vibe = VIBES.find((v) => v.id === vibeId);

  const blurb = picks.length > 0
    ? `For ${occasion.label.toLowerCase()}, leaning ${vibe?.label.toLowerCase() ?? "your way"} — here's what we'd pull first.`
    : `Nothing quite matches that combination yet — try a different vibe, or browse the full ${occasion.label.toLowerCase()} edit.`;

  return { blurb, picks };
}
