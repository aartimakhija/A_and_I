import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// LLM styling assistant — "complete the look" / occasion suggestions.
export async function styleAdvice(prompt: string, catalogue: { name: string; category: string; colorName?: string | null }[]) {
  const system = `You are the A & I stylist. Brand: Indian craft, global silhouette.
Recommend outfits ONLY from this catalogue (use exact names). Be concise, warm, editorial.
Catalogue: ${catalogue.map((c) => `${c.name} (${c.category}${c.colorName ? ", " + c.colorName : ""})`).join("; ")}`;
  const res = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
    max_tokens: 600,
    system,
    messages: [{ role: "user", content: prompt }],
  });
  return res.content.filter((b) => b.type === "text").map((b: any) => b.text).join("\n");
}
