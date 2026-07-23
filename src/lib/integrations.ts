// Thin clients for external services. Fill in tokens via env; all fail-soft.

export async function sendWhatsApp(to: string, template: string, vars: string[] = []) {
  if (!process.env.WHATSAPP_TOKEN) return { skipped: true };
  const r = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp", to,
      type: "template",
      template: { name: template, language: { code: "en" }, components: vars.length ? [{ type: "body", parameters: vars.map((t) => ({ type: "text", text: t })) }] : [] },
    }),
  });
  return r.json();
}

export async function sendSMS(to: string, body: string) {
  if (!process.env.SMS_API_KEY) return { skipped: true };
  // TODO: wire your SMS gateway (MSG91 / Twilio). Placeholder shape:
  return { to, body, queued: true };
}

export async function fetchInstagramFeed(limit = 8) {
  if (!process.env.INSTAGRAM_TOKEN) return [];
  const url = `https://graph.instagram.com/${process.env.INSTAGRAM_USER_ID}/media?fields=id,media_url,permalink,caption&limit=${limit}&access_token=${process.env.INSTAGRAM_TOKEN}`;
  const r = await fetch(url, { next: { revalidate: 3600 } });
  const j = await r.json();
  return j.data ?? [];
}
