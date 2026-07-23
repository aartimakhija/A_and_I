// Thin, carrier-agnostic shipping client — mirrors the pattern in integrations.ts.
// Swap the body of createShipment/trackShipment for a real Shiprocket/Delhivery/
// Bluedart call once SHIPPING_API_KEY is set; until then it fails soft and the
// admin can still fill in carrier + tracking number manually (see the order
// status-update form), which is enough to keep the OMS usable pre-integration.

export type CarrierResult = { trackingNumber: string; trackingUrl: string; estDelivery?: string };

export async function createShipment(order: { number: string; shipPincode?: string | null }): Promise<CarrierResult | null> {
  const provider = process.env.SHIPPING_PROVIDER;
  if (!provider || provider === "manual" || !process.env.SHIPPING_API_KEY) return null;

  if (provider === "shiprocket") {
    // TODO: POST to https://apiv2.shiprocket.in/v1/external/orders/create/adhoc
    // with SHIPPING_API_KEY (bearer token from Shiprocket's /auth/login), the
    // order's line items, and shipPincode. Return the AWB/tracking number.
    return null;
  }
  if (provider === "delhivery") {
    // TODO: POST to Delhivery's /cmu/create.json waybill endpoint.
    return null;
  }
  return null;
}

export function trackingUrlFor(carrier: string | null | undefined, trackingNumber: string | null | undefined) {
  if (!trackingNumber) return null;
  switch ((carrier || "").toLowerCase()) {
    case "delhivery": return `https://www.delhivery.com/track/package/${trackingNumber}`;
    case "bluedart": return `https://www.bluedart.com/tracking?awb=${trackingNumber}`;
    case "dtdc": return `https://www.dtdc.in/trace.asp?strCnno=${trackingNumber}`;
    case "shiprocket": return `https://shiprocket.co/tracking/${trackingNumber}`;
    default: return null;
  }
}

export const CARRIERS = ["Delhivery", "Bluedart", "DTDC", "Shiprocket", "Self-delivery"] as const;
