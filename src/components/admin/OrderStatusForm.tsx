"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const SHIPMENT_STATUSES = ["LABEL_CREATED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "RTO"];
const CARRIERS = ["Delhivery", "Bluedart", "DTDC", "Shiprocket", "Self-delivery"];

export default function OrderStatusForm({
  orderId, currentStatus, shipment,
}: {
  orderId: string;
  currentStatus: string;
  shipment: { carrier: string | null; trackingNumber: string | null; status: string | null } | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [carrier, setCarrier] = useState(shipment?.carrier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(shipment?.trackingNumber ?? "");
  const [shipmentStatus, setShipmentStatus] = useState(shipment?.status ?? "LABEL_CREATED");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, carrier: carrier || null, trackingNumber: trackingNumber || null, shipmentStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "update failed");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", marginTop: 4 };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginTop: 16 };

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", padding: 24, maxWidth: 480 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Order status &amp; delivery</div>
      {error && <div style={{ background: "#fdecea", color: "#B0503E", padding: 10, marginTop: 10, fontSize: 12 }}>{error}</div>}

      <label style={label}>Order status</label>
      <select style={field} value={status} onChange={(e) => setStatus(e.target.value)}>
        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <label style={label}>Carrier</label>
      <select style={field} value={carrier} onChange={(e) => setCarrier(e.target.value)}>
        <option value="">— none yet —</option>
        {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <label style={label}>Tracking number</label>
      <input style={field} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. AWB1234567890" />

      <label style={label}>Shipment status</label>
      <select style={field} value={shipmentStatus} onChange={(e) => setShipmentStatus(e.target.value)}>
        {SHIPMENT_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
      </select>
      <p style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
        Setting a shipment status other than "Label created" auto-advances the order to SHIPPED, and DELIVERED does the same for the order status —
        override with the dropdown above if needed. The customer gets a WhatsApp update once a tracking number is set.
      </p>

      <button onClick={save} disabled={saving} style={{ marginTop: 20, padding: "12px 28px", background: "#0a0a0a", color: "#fff", border: 0, cursor: "pointer" }}>
        {saving ? "Saving…" : "Update order"}
      </button>
    </div>
  );
}
