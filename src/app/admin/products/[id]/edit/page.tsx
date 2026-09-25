import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/rbac";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/categories";
import ProductForm from "@/components/admin/ProductForm";
import { Badge, Button, PageHeader } from "@/components/admin/ui";
import { productStatusTone } from "@/lib/status-tone";
import { ProductFormErrorBoundary } from "@/components/admin/ProductFormErrorBoundary";

export default async function EditProduct({ params }: { params: { id: string } }) {
  // TEMPORARY diagnostic wrapper: Next.js redacts the real error message for
  // anything thrown during a Server Component's render in production builds
  // (even inside our own admin error.tsx), replacing it with "the specific
  // message is omitted..." — so the previous fix showed a nicer box but
  // still couldn't reveal what's actually breaking. Catching it here, before
  // it becomes an uncaught render error, lets us print the real message and
  // stack straight into the page instead of losing it to that redaction.
  // Once we see the real cause, this gets replaced with a proper fix.
  let s: Awaited<ReturnType<typeof getSession>>;
  let product, vendors, categories, materials;
  try {
    s = await getSession();
    [product, vendors, categories, materials] = await Promise.all([
      prisma.product.findUnique({
        where: { id: params.id },
        include: { images: { orderBy: { position: "asc" } }, variants: true, tiers: { orderBy: { position: "asc" } }, bom: true },
      }),
      s.role === "ADMIN" ? prisma.vendor.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }) : [],
      getCategories(true), // include inactive so an existing product keeps showing its (now-deactivated) category correctly
      prisma.material.findMany({ select: { id: true, name: true, unit: true }, orderBy: { name: "asc" } }),
    ]);
  } catch (err: any) {
    return (
      <div style={{ padding: 32, maxWidth: 900, fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Diagnostic: data fetch for this product failed</h1>
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

  if (!product) notFound();
  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={`/${product.slug}`}
        backHref="/admin/products"
        backLabel="Catalogue"
        actions={
          <>
            <Badge tone={productStatusTone(product.status)}>{product.status.replace("_", " ")}</Badge>
            {product.status === "ACTIVE" && (
              <Button href={`/products/${product.slug}`} target="_blank" variant="ghost">
                View live ↗
              </Button>
            )}
          </>
        }
      />
      <ProductFormErrorBoundary>
        <ProductForm vendors={vendors} categories={categories} materials={materials} isAdmin={s.role === "ADMIN"} product={product} />
      </ProductFormErrorBoundary>
    </>
  );
}
