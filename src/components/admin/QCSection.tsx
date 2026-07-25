"use client";
import { useState } from "react";
import QCForm from "./QCForm";

type Check = { id: string; result: string; qtyChecked: number; qtyPassed: number; qtyFailed: number; notes: string | null; createdAt: string };
type Item = { id: string; description: string; size: string | null; qty: number; productId: string | null; qualityChecks: Check[] };

export default function QCSection({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const qcEligible = items.filter((it) => it.productId && it.size);

  if (qcEligible.length === 0) return null;

  return (
    <div className="no-print" style={{ marginTop: 32, paddingTop: 20, borderTop: "2px solid #111" }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Quality control</div>
      {qcEligible.map((it) => {
        const totalPassed = it.qualityChecks.reduce((s, c) => s + c.qtyPassed, 0);
        const remaining = Math.max(0, it.qty - it.qualityChecks.reduce((s, c) => s + c.qtyChecked, 0));
        return (
          <div key={it.id} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{it.description} ({it.size}) — {totalPassed}/{it.qty} passed so far</div>
            {it.qualityChecks.length > 0 && (
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {it.qualityChecks.map((c) => (
                  <div key={c.id} style={{ fontSize: 12, color: "#666" }}>
                    {new Date(c.createdAt).toLocaleDateString("en-IN")} — <strong>{c.result}</strong> ({c.qtyPassed} pass / {c.qtyFailed} fail){c.notes ? ` — ${c.notes}` : ""}
                  </div>
                ))}
              </div>
            )}
            {remaining > 0 && (
              open[it.id] ? (
                <QCForm poItemId={it.id} maxQty={remaining} productName={it.description} size={it.size} />
              ) : (
                <button onClick={() => setOpen((o) => ({ ...o, [it.id]: true }))} style={{ marginTop: 6, fontSize: 12, background: "none", border: "1px solid #ccc", padding: "6px 14px", cursor: "pointer" }}>
                  Run QC on remaining {remaining}
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
