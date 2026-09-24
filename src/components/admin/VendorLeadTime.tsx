"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorLeadTime({ id, days }: { id: string; days: number }) {
  const router = useRouter();
  const [value, setValue] = useState(days);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (value === days) return;
    setBusy(true);
    try {
      await fetch(`/api/vendors/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadTimeDays: value }) });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <input
      type="number"
      min={1}
      value={value}
      disabled={busy}
      onChange={(e) => setValue(parseInt(e.target.value || "0", 10))}
      onBlur={save}
      className="w-16 rounded-sm border border-neutral-300 px-2 py-1 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
    />
  );
}
