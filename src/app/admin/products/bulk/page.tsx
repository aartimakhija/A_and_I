import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import BulkImportForm from "@/components/admin/BulkImportForm";

export default async function BulkImportPage() {
  const s = await getSession();
  const vendors = s.role === "ADMIN" ? await prisma.vendor.findMany({ select: { slug: true }, orderBy: { name: "asc" } }) : [];
  return (
    <>
      <h1>Bulk import</h1>
      <div style={{ marginTop: 24 }}>
        <BulkImportForm vendorSlugs={vendors.map((v) => v.slug)} isAdmin={s.role === "ADMIN"} />
      </div>
    </>
  );
}
