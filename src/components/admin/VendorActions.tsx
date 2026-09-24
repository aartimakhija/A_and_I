"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admin/ui";

export default function VendorActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-1.5">
      <Button size="sm" variant="secondary" disabled={busy || status === "APPROVED"} onClick={() => setStatus("APPROVED")}>
        Approve
      </Button>
      <Button size="sm" variant="secondary" disabled={busy || status === "SUSPENDED"} onClick={() => setStatus("SUSPENDED")}>
        Suspend
      </Button>
    </div>
  );
}
