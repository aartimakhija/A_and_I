import QRCode from "qrcode";
import { customAlphabet } from "nanoid";
const code = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

export function newSerial() { return "AI-" + code(); }

export function passportUrl(serial: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/passport/${serial}`;
}

// Returns a data-URL QR that resolves to the public passport page.
// (NFC: write the same URL to an NTAG; the page renders provenance.)
export async function passportQR(serial: string) {
  return QRCode.toDataURL(passportUrl(serial), { margin: 1, width: 320 });
}
