import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { uploadImageBuffer, storageBackend } from "@/lib/storage";

// Admin/vendor product-image upload. Accepts multipart/form-data with a "file" field.
// Returns { url } — save that into ProductImage.url via the products API.
export async function POST(req: NextRequest) {
  await requireRole(["ADMIN", "VENDOR"]);
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "file field required" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "must be an image" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "max 8MB" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await uploadImageBuffer(buffer, { filename: file.name, contentType: file.type, folder: "products" });
  return NextResponse.json({ url, backend: storageBackend });
}
