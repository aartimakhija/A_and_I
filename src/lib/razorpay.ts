import Razorpay from "razorpay";
import crypto from "crypto";

// Built lazily, not at module load — with RAZORPAY_KEY_ID/SECRET unset (the
// default until you add real keys), constructing this eagerly at import time
// throws immediately and takes down every route that imports this file,
// including at build time. Delaying construction until a checkout/refund is
// actually attempted means the rest of the app keeps working without keys,
// and the error only surfaces where it's actually relevant.
let _razorpay: Razorpay | null = null;
function getClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to accept payments.");
  }
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }
  return _razorpay;
}

export async function createRzpOrder(amountPaise: number, receipt: string) {
  return getClient().orders.create({ amount: amountPaise, currency: "INR", receipt, payment_capture: true });
}

// Verify the checkout handshake signature (client callback)
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); }
  catch { return false; }
}

// Verify a webhook body against the webhook secret
export function verifyWebhook(rawBody: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(rawBody)
    .digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); }
  catch { return false; }
}

// Issue a refund against a captured payment — used by the returns/refunds workflow.
// amountPaise omitted = full refund of the original payment.
export async function refundPayment(rzpPaymentId: string, amountPaise?: number) {
  return getClient().payments.refund(rzpPaymentId, amountPaise ? { amount: amountPaise } : {});
}
