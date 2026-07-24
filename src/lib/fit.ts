// A deliberately simple, explainable size heuristic — not a medical or
// precision garment-fit model. Combines what the person already knows about
// their size in other brands with a broad height/weight bracket, and meets
// in the middle. Good enough to pre-select a size and give the AI stylist
// useful context; the person can always change it on the product page.

export const SIZES = ["XS", "S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

export type FitAnswers = {
  heightCm: number;
  weightKg: number;
  usualSize: Size; // self-reported, from any brand
  fitPreference: "loose" | "true-to-size" | "fitted";
};

function bracketFromHeightWeight(heightCm: number, weightKg: number): number {
  // crude BMI-adjacent bracket → index 0..4 (XS..XL). Intentionally coarse.
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  if (bmi < 18.5) return 0;
  if (bmi < 21) return 1;
  if (bmi < 24) return 2;
  if (bmi < 27) return 3;
  return 4;
}

export function recommendSize(a: FitAnswers): { size: Size; note: string } {
  const reportedIdx = SIZES.indexOf(a.usualSize);
  const bracketIdx = bracketFromHeightWeight(a.heightCm, a.weightKg);
  let idx = Math.round((reportedIdx + bracketIdx) / 2);
  if (a.fitPreference === "loose") idx += 1;
  if (a.fitPreference === "fitted") idx -= 1;
  idx = Math.max(0, Math.min(SIZES.length - 1, idx));
  const size = SIZES[idx];

  const note = idx === reportedIdx
    ? `Matches what you usually wear — we'd suggest ${size}.`
    : `A little different from your usual size — we'd suggest ${size} based on your details, but ${a.usualSize} is a safe bet too if you prefer.`;
  return { size, note };
}
