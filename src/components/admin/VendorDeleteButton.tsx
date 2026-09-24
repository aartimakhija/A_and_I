"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, fieldClass } from "@/components/admin/ui";

type OtherVendor = { id: string; name: string };
type Counts = { products: number; materials: number; materialOrders: number };

export default function VendorDeleteButton({
  id,
  name,
  otherVendors,
}: {
  id: string;
  name: string;
  otherVendors: OtherVendor[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reassignCounts, setReassignCounts] = useState<Counts | null>(null);
  const [reassignTo, setReassignTo] = useState(otherVendors[0]?.id ?? "");

  async function attemptDelete(withReassign?: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withReassign ? { reassignTo: withReassign } : {}),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setConfirmOpen(false);
        setReassignCounts(null);
        router.refresh();
        return;
      }
      if (res.status === 409 && json.needsReassign) {
        setReassignCounts(json.counts);
        return;
      }
      setError(json.error || "Couldn't delete this vendor.");
    } finally {
      setBusy(false);
    }
  }

  function openConfirm() {
    setError("");
    setReassignCounts(null);
    setConfirmOpen(true);
  }

  const totalAttached = reassignCounts ? reassignCounts.products + reassignCounts.materials + reassignCounts.materialOrders : 0;

  return (
    <>
      <Button size="sm" variant="danger" onClick={openConfirm}>
        Delete
      </Button>

      <Modal open={confirmOpen} onClose={() => !busy && setConfirmOpen(false)} title={`Delete “${name}”?`} width={440}>
        {!reassignCounts ? (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">This can't be undone. If this vendor turns out to have products or materials attached, you'll be asked where to move them first.</p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={busy}>Cancel</Button>
              <Button variant="danger" onClick={() => attemptDelete()} disabled={busy}>
                {busy ? "Deleting…" : "Delete vendor"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              “{name}” still has{" "}
              <strong>
                {[
                  reassignCounts.products > 0 && `${reassignCounts.products} product${reassignCounts.products === 1 ? "" : "s"}`,
                  reassignCounts.materials > 0 && `${reassignCounts.materials} material${reassignCounts.materials === 1 ? "" : "s"}`,
                  reassignCounts.materialOrders > 0 && `${reassignCounts.materialOrders} material order${reassignCounts.materialOrders === 1 ? "" : "s"}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </strong>{" "}
              attached ({totalAttached} total). Move them to another vendor first, then it'll be deleted.
            </p>
            {otherVendors.length === 0 ? (
              <p className="text-sm text-red-600">There's no other vendor to move these to — create one first.</p>
            ) : (
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wide text-neutral-500">Move everything to</label>
                <select className={`${fieldClass} mt-1`} value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
                  {otherVendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={busy}>Cancel</Button>
              <Button variant="danger" onClick={() => attemptDelete(reassignTo)} disabled={busy || otherVendors.length === 0}>
                {busy ? "Moving & deleting…" : "Unlink & delete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
