import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRzpOrder(amountPaise: number, receipt: string) {
  return razorpay.orders.create({ amount: amountPaise, currency: "INR", receipt, payment_capture: true });
}

// Verify the checkout handshake signature (client callback)
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// Verify a webhook body against the webhook secret
export function verifyWebhook(rawBody: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); }
  catch { return false; }
}

// Issue a refund against a captured payment — used by the returns/refunds workflow.
// amountPaise omitted = full refund of the original payment.
export async function refundPayment(rzpPaymentId: string, amountPaise?: number) {
  return razorpay.payments.refund(rzpPaymentId, amountPaise ? { amount: amountPaise } : {});
}
