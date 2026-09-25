"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button } from "@/components/admin/ui";
import { productStatusTone } from "@/lib/status-tone";

type ProductRow = {
  id: string; name: string; category: string; vendorName: string; price: number; stock: number;
  status: string; thumbnail: string | null; preOrder: boolean;
};

const STATUS_FILTERS = ["ALL", "ACTIVE", "DRAFT", "SOLD_OUT", "ARCHIVED"] as const;

export default function BulkSelectTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.vendorName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });
  }, [products, query, statusFilter]);

  const allChecked = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(allChecked ? new Set() : new Set([...selected, ...filtered.map((p) => p.id)]));

  async function bulkPatch(data: Record<string, unknown>) {
    setBusy(true);
    try {
      await Promise.all(
        [...selected].map((id) =>
          fetch(`/api/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        )
      );
      setSelected(new Set());
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function goToProduct(id: string, e: React.MouseEvent) {
    // Let clicks on interactive children (checkbox, links, buttons) behave normally.
    if ((e.target as HTMLElement).closest("a,button,input")) return;
    router.push(`/admin/products/${id}/edit`);
  }

  return (
    <div className="mt-6">
      {/* Search + status filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, category or vendor…"
          className="w-full max-w-xs rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-400">
          {filtered.length} of {products.length}
        </span>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-20 mb-3 flex flex-wrap items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2.5 shadow-sm">
          <span className="text-xs font-medium text-neutral-700">{selected.size} selected</span>
          <Button size="sm" disabled={busy} onClick={() => bulkPatch({ status: "ACTIVE" })}>Activate</Button>
          <Button size="sm" disabled={busy} onClick={() => bulkPatch({ status: "ARCHIVED" })}>Archive</Button>
          <Button size="sm" disabled={busy} onClick={() => bulkPatch({ status: "SOLD_OUT" })}>Mark sold out</Button>
          <span className="mx-1 h-5 w-px bg-neutral-200" />
          <Button size="sm" disabled={busy} onClick={() => bulkPatch({ preOrder: true })}>Enable pre-order</Button>
          <Button size="sm" disabled={busy} onClick={() => bulkPatch({ preOrder: false })}>Disable pre-order</Button>
          {busy && <span className="text-xs text-neutral-400">Updating…</span>}
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-neutral-400 hover:text-neutral-700"
            aria-label="Clear selection"
          >
            Clear ✕
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-neutral-200 bg-white">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="h-4 w-4" />
              </th>
              <th className="w-14 px-2 py-3" />
              {["Name", "Category", "Vendor", "Price", "Stock", "Status", "Pre-order"].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500 ${
                    h === "Price" || h === "Stock" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-neutral-400">
                  No products match your filters.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={(e) => goToProduct(p.id, e)}
                className="cursor-pointer border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-50"
              >
                <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} className="h-4 w-4" />
                </td>
                <td className="px-2 py-2.5">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt="" className="h-12 w-10 rounded-sm border border-neutral-200 object-cover" />
                  ) : (
                    <div className="h-12 w-10 rounded-sm border border-neutral-200 bg-neutral-100" />
                  )}
                </td>
                <td className="max-w-[280px] px-4 py-2.5">
                  <div className="truncate font-medium text-neutral-900">{p.name}</div>
                </td>
                <td className="max-w-[110px] px-4 py-2.5">
                  <span className="truncate block text-neutral-600">{p.category}</span>
                </td>
                <td className="max-w-[180px] px-4 py-2.5">
                  <span className="block truncate text-neutral-600" title={p.vendorName}>{p.vendorName}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-neutral-700">
                  ₹{(p.price / 100).toLocaleString("en-IN")}
                </td>
                <td className={`whitespace-nowrap px-4 py-2.5 text-right tabular-nums ${p.stock === 0 ? "text-red-600" : "text-neutral-700"}`}>
                  {p.stock}
                </td>
                <td className="px-4 py-2.5">
                  <Badge tone={productStatusTone(p.status)}>{p.status.replace("_", " ")}</Badge>
                </td>
                <td className="px-4 py-2.5">
                  {p.preOrder ? <Badge tone="blue">Pre-order</Badge> : <span className="text-neutral-300">—</span>}
                </td>
                <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1.5">
                    <Button href={`/admin/products/${p.id}/edit`} size="sm" variant="secondary">Edit</Button>
                    <Button href={`/admin/products/${p.id}/label`} size="sm" variant="ghost">Label</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
