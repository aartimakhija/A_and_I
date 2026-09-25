// Vendor management
import { prisma } from "@/lib/prisma";
import { Badge, Button, Card, PageHeader, vendorStatusTone } from "@/components/admin/ui";
import VendorActions from "@/components/admin/VendorActions";
import VendorDeleteButton from "@/components/admin/VendorDeleteButton";
import VendorLeadTime from "@/components/admin/VendorLeadTime";
import NewVendorButton from "@/components/admin/NewVendorButton";

export default async function AdminVendors() {
  // TEMPORARY diagnostic: this and several other admin pages have started
  // showing Next's generic "omitted in production" error. Catching the
  // fetch here (before it becomes an uncaught render error subject to that
  // redaction) prints the real message/code — this will tell us whether
  // it's a DB/connection problem or something else. Remove once we know.
  let vendors: any[];
  try {
    vendors = await prisma.vendor.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch (err: any) {
    return (
      <div style={{ padding: 32, maxWidth: 900, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Diagnostic: vendors fetch failed</h1>
        <div style={{ background: "#fdecea", color: "#8a2f22", padding: 16, borderRadius: 4, fontSize: 13, whiteSpace: "pre-wrap", wordBreak: "break-word", marginBottom: 16 }}>
          <strong>{err?.name || "Error"}:</strong> {String(err?.message ?? err)}
        </div>
        {err?.code && <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Prisma code: {err.code}</p>}
        {err?.meta && (
          <pre style={{ fontSize: 11, background: "#f5f3ef", padding: 12, borderRadius: 4, overflowX: "auto", marginBottom: 16 }}>{JSON.stringify(err.meta, null, 2)}</pre>
        )}
        {err?.stack && (
          <pre style={{ fontSize: 11, background: "#f5f3ef", padding: 12, borderRadius: 4, overflowX: "auto" }}>{String(err.stack)}</pre>
        )}
      </div>
    );
  }
  const allVendorOptions = vendors.map((v) => ({ id: v.id, name: v.name }));

  return (
    <>
      <PageHeader
        title="Vendors"
        subtitle={`${vendors.length} vendor${vendors.length === 1 ? "" : "s"}`}
        actions={<NewVendorButton />}
      />

      <Card className="overflow-hidden" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                {["Name", "Contact", "Status", "Commission", "MOQ", "Lead time (days)", "Products", "", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-neutral-400">No vendors yet.</td>
                </tr>
              )}
              {vendors.map((v) => (
                <tr key={v.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{v.name}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    <div>{v.email}</div>
                    {v.phone && <div className="text-xs text-neutral-400">{v.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={vendorStatusTone(v.status)}>{v.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{(v.commission * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 text-neutral-600">{v.moq}</td>
                  <td className="px-4 py-3"><VendorLeadTime id={v.id} days={v.leadTimeDays} /></td>
                  <td className="px-4 py-3 text-neutral-600">{v._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <VendorActions id={v.id} status={v.status} />
                      <VendorDeleteButton id={v.id} name={v.name} otherVendors={allVendorOptions.filter((o) => o.id !== v.id)} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button href={`/admin/purchase-orders/new?vendorId=${v.id}`} size="sm" variant="ghost">
                      Create production order
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
