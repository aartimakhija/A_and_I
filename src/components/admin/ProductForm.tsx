"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, fieldClass, labelClass } from "@/components/admin/ui";

type Vendor = { id: string; name: string };
type ImageRow = { url: string };
type MaterialOption = { id: string; name: string; unit: string };
type Props = {
  vendors: Vendor[];
  categories: { slug: string; name: string }[];
  materials: MaterialOption[];
  isAdmin: boolean;
  product?: {
    id: string; slug: string; name: string; story: string | null;
    features: string | null; fitNotes: string | null; careNotes: string | null; deliveryNotes: string | null; limitedEdition: boolean;
    category: string;
    colorHex: string; colorName: string | null; basePrice: number; discountPercent: number | null; costPrice: number | null; vendorCost: number | null; status: string;
    silhouette: string | null; modelNote: string | null; madeCount: number | null; pairWith: string[]; videoUrl: string | null;
    sketchImageUrl: string | null; paletteImageUrl: string | null; makingImageUrl: string | null; fabricImageUrl: string | null; careImageUrl: string | null;
    vendorId: string; images: ImageRow[]; featured: boolean; featuredOrder: number; lookbookOrder: number | null; preOrder: boolean;
    variants: { size: string; stock: number }[];
    tiers: { label: string; priceAdd: number }[];
    bom: { materialId: string; qtyPerUnit: number }[];
  };
};

const SIZES = ["XS", "S", "M", "L", "XL"];

const STORY_IMAGE_FIELDS = [
  { key: "sketchImageUrl", label: "Sketch / illustration", hint: "The original design sketch — shown in “The idea”" },
  { key: "paletteImageUrl", label: "Colour & material palette", hint: "Fabric swatches, trims, hardware — shown in “From line to palette”" },
  { key: "makingImageUrl", label: "The making (behind the scenes)", hint: "Hands at work / construction — shown in “The hand behind the piece”" },
  { key: "fabricImageUrl", label: "Fabric close-up", hint: "Macro shot of the weave or cutwork — shown in “The cloth, up close”" },
  { key: "careImageUrl", label: "Care", hint: "Garment care / steaming shot — shown alongside care instructions" },
] as const;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductForm({ vendors, categories, materials, isAdmin, product }: Props) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [story, setStory] = useState(product?.story ?? "");
  const [features, setFeatures] = useState(product?.features ?? "");
  const [fitNotes, setFitNotes] = useState(product?.fitNotes ?? "");
  const [careNotes, setCareNotes] = useState(product?.careNotes ?? "");
  const [deliveryNotes, setDeliveryNotes] = useState(product?.deliveryNotes ?? "");
  const [limitedEdition, setLimitedEdition] = useState(product?.limitedEdition ?? false);
  const [category, setCategory] = useState(product?.category ?? categories[0]?.slug ?? "");
  const [colorHex, setColorHex] = useState(product?.colorHex ?? "#8A7A6A");
  const [colorName, setColorName] = useState(product?.colorName ?? "");
  const [silhouette, setSilhouette] = useState(product?.silhouette ?? "");
  const [modelNote, setModelNote] = useState(product?.modelNote ?? "");
  const [madeCount, setMadeCount] = useState(product?.madeCount?.toString() ?? "");
  const [pairWith, setPairWith] = useState((product?.pairWith ?? []).join(", "));
  const [videoUrl, setVideoUrl] = useState(product?.videoUrl ?? "");
  const [basePrice, setBasePrice] = useState(((product?.basePrice ?? 480000) / 100).toString());
  const [discountPercent, setDiscountPercent] = useState(product?.discountPercent?.toString() ?? "");
  const [costPrice, setCostPrice] = useState(product?.costPrice ? (product.costPrice / 100).toString() : "");
  const [vendorCost, setVendorCost] = useState(product?.vendorCost ? (product.vendorCost / 100).toString() : "");
  const [status, setStatus] = useState(product?.status ?? "ACTIVE");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [featuredOrder, setFeaturedOrder] = useState(product?.featuredOrder ?? 0);
  const [inLookbook, setInLookbook] = useState(product?.lookbookOrder != null);
  const [lookbookOrder, setLookbookOrder] = useState(product?.lookbookOrder ?? 0);
  const [preOrder, setPreOrder] = useState(product?.preOrder ?? false);
  const [bom, setBom] = useState<{ materialId: string; qtyPerUnit: number }[]>(product?.bom ?? []);
  const [vendorId, setVendorId] = useState(product?.vendorId ?? vendors[0]?.id ?? "");
  const [images, setImages] = useState<string[]>(product?.images.map((i) => i.url) ?? []);
  const [storyImages, setStoryImages] = useState<Record<string, string>>({
    sketchImageUrl: product?.sketchImageUrl ?? "",
    paletteImageUrl: product?.paletteImageUrl ?? "",
    makingImageUrl: product?.makingImageUrl ?? "",
    fabricImageUrl: product?.fabricImageUrl ?? "",
    careImageUrl: product?.careImageUrl ?? "",
  });
  const [storyUploading, setStoryUploading] = useState<Record<string, boolean>>({});
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(SIZES.map((s) => [s, product?.variants.find((v) => v.size === s)?.stock ?? 6]))
  );
  const [tiers, setTiers] = useState(
    product?.tiers.map((t) => ({ label: t.label, priceAdd: t.priceAdd / 100 })) ?? [
      { label: "Signature linen", priceAdd: 0 },
      { label: "Premium handloom", priceAdd: 1500 },
      { label: "Hand-embroidered couture", priceAdd: 3500 },
    ]
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      setImages((imgs) => [...imgs, json.url]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onStoryUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStoryUploading((u) => ({ ...u, [key]: true }));
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      setStoryImages((s) => ({ ...s, [key]: json.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setStoryUploading((u) => ({ ...u, [key]: false }));
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), story, category,
      features: features || null, fitNotes: fitNotes || null, careNotes: careNotes || null, deliveryNotes: deliveryNotes || null, limitedEdition,
      colorHex, colorName, basePrice: Math.round(parseFloat(basePrice || "0") * 100), status,
      silhouette: silhouette || null, modelNote: modelNote || null,
      madeCount: madeCount ? parseInt(madeCount, 10) : null,
      pairWith: pairWith.split(",").map((s) => s.trim()).filter(Boolean),
      videoUrl: videoUrl || null,
      sketchImageUrl: storyImages.sketchImageUrl || null,
      paletteImageUrl: storyImages.paletteImageUrl || null,
      makingImageUrl: storyImages.makingImageUrl || null,
      fabricImageUrl: storyImages.fabricImageUrl || null,
      careImageUrl: storyImages.careImageUrl || null,
      discountPercent: discountPercent ? Math.min(99, Math.max(0, parseInt(discountPercent, 10))) : null,
      costPrice: costPrice ? Math.round(parseFloat(costPrice) * 100) : null,
      vendorCost: vendorCost ? Math.round(parseFloat(vendorCost) * 100) : null,
      featured, featuredOrder, lookbookOrder: inLookbook ? lookbookOrder : null, preOrder,
      vendorId: isAdmin ? vendorId : undefined,
      images,
      variants: SIZES.map((s) => ({ size: s, stock: stock[s] ?? 0 })),
      tiers: tiers.map((t, i) => ({ label: t.label, priceAdd: Math.round(t.priceAdd * 100), position: i })),
      bom: bom.filter((b) => b.materialId),
    };
    try {
      const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.formErrors?.join(", ") || json.error || "save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const textareaClass = `${fieldClass} min-h-[80px] resize-y`;

  const ImageThumb = ({ url, onRemove }: { url: string; onRemove: () => void }) => (
    <div className="relative">
      <img src={url} alt="" className="h-24 w-20 rounded-sm border border-neutral-200 object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs text-white hover:bg-neutral-700"
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="pb-4">
      {error && (
        <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main column ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card title="Basic details">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Name</label>
                <input className={`${fieldClass} mt-1`} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Slug (URL)</label>
                <input
                  className={`${fieldClass} mt-1`}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={name ? slugify(name) : "auto-generated from name if blank"}
                />
                {!slug && name && <p className="mt-1 text-xs text-neutral-400">Will save as “{slugify(name)}”.</p>}
              </div>
            </div>
          </Card>

          <Card title="Story & content" description="What shows up in the tabs and captions on the product page.">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Story</label>
                <textarea className={`${textareaClass} mt-1 min-h-[100px]`} value={story} onChange={(e) => setStory(e.target.value)} placeholder="Narrative/description tab on the product page" />
              </div>
              <div>
                <label className={labelClass}>Features (optional)</label>
                <textarea className={`${textareaClass} mt-1`} value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="e.g. Adjustable drawstring waist, side pockets, mother-of-pearl buttons" />
              </div>
              <div>
                <label className={labelClass}>Fit (optional)</label>
                <textarea className={`${textareaClass} mt-1`} value={fitNotes} onChange={(e) => setFitNotes(e.target.value)} placeholder={`e.g. True to size. Model is 5'6" wearing size M.`} />
              </div>
              <div>
                <label className={labelClass}>Care (optional)</label>
                <textarea className={`${textareaClass} mt-1`} value={careNotes} onChange={(e) => setCareNotes(e.target.value)} placeholder="e.g. Dry clean only. Iron on reverse." />
              </div>
              <div>
                <label className={labelClass}>Delivery (optional — leave blank to use the sitewide default)</label>
                <textarea className={`${textareaClass} mt-1`} value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Silhouette (optional — one line, shown as a gallery caption)</label>
                <input className={`${fieldClass} mt-1`} value={silhouette} onChange={(e) => setSilhouette(e.target.value)} placeholder="e.g. Fitted cropped bodice paired with a full handkerchief skirt" />
              </div>
            </div>
          </Card>

          <Card title="Merchandising" description="Styling context and cross-sell details.">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Model note (optional)</label>
                  <input className={`${fieldClass} mt-1`} value={modelNote} onChange={(e) => setModelNote(e.target.value)} placeholder={`e.g. Our model is 5'8" and wears a S/M.`} />
                </div>
                <div>
                  <label className={labelClass}>Made count (optional)</label>
                  <input className={`${fieldClass} mt-1`} type="number" min={0} value={madeCount} onChange={(e) => setMadeCount(e.target.value)} placeholder="Units made in this limited run" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Pair with (optional — comma-separated product slugs shown as styling suggestions)</label>
                <input className={`${fieldClass} mt-1`} value={pairWith} onChange={(e) => setPairWith(e.target.value)} placeholder="e.g. flirting-in-fuchsia, olive-temptation" />
              </div>
              <div>
                <label className={labelClass}>Video URL (optional — short product film, e.g. from your S3/R2 bucket)</label>
                <input className={`${fieldClass} mt-1`} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" className="h-4 w-4" checked={limitedEdition} onChange={(e) => setLimitedEdition(e.target.checked)} />
                Limited Edition <span className="text-neutral-400">— shows a badge on the storefront</span>
              </label>
            </div>
          </Card>

          <Card title="Photography">
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Gallery images</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {images.map((url, i) => (
                    <ImageThumb key={i} url={url} onRemove={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))} />
                  ))}
                  <label className="flex h-24 w-20 cursor-pointer items-center justify-center rounded-sm border border-dashed border-neutral-300 text-2xl text-neutral-400 hover:border-neutral-400 hover:text-neutral-600">
                    {uploading ? "…" : "+"}
                    <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  Uploads go to S3/R2 in production, or /public/uploads in dev (see storageBackend in src/lib/storage.ts).
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-5">
                <label className={labelClass}>Story photography (optional)</label>
                <p className="mt-1 text-xs text-neutral-400">
                  Dedicated images for the "idea → making → fabric" narrative shown below the fold on the product page.
                  Leave any of these blank and that section falls back to the product's regular photos above.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {STORY_IMAGE_FIELDS.map(({ key, label: fieldLabel, hint }) => (
                    <div key={key} className="flex flex-col items-start gap-3 rounded-sm border border-neutral-200 p-3">
                      {storyImages[key] ? (
                        <ImageThumb url={storyImages[key]} onRemove={() => setStoryImages((s) => ({ ...s, [key]: "" }))} />
                      ) : (
                        <label className="flex h-24 w-20 cursor-pointer items-center justify-center rounded-sm border border-dashed border-neutral-300 text-2xl text-neutral-400 hover:border-neutral-400 hover:text-neutral-600">
                          {storyUploading[key] ? "…" : "+"}
                          <input type="file" accept="image/*" onChange={(e) => onStoryUpload(key, e)} className="hidden" disabled={!!storyUploading[key]} />
                        </label>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-neutral-800">{fieldLabel}</div>
                        <div className="mt-0.5 text-[11px] leading-snug text-neutral-400">{hint}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Bill of materials">
            {materials.length === 0 ? (
              <p className="text-sm text-neutral-400">
                No materials yet — add some under <a href="/admin/materials" className="underline">Materials</a> first.
              </p>
            ) : (
              <div className="space-y-2">
                {bom.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <select
                      className={`${fieldClass} flex-1`}
                      value={row.materialId}
                      onChange={(e) => setBom((rows) => rows.map((r, idx) => (idx === i ? { ...r, materialId: e.target.value } : r)))}
                    >
                      <option value="">— select material —</option>
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.unit})
                        </option>
                      ))}
                    </select>
                    <input
                      className={`${fieldClass} w-32`}
                      type="number"
                      placeholder="Qty per unit"
                      value={row.qtyPerUnit}
                      onChange={(e) => setBom((rows) => rows.map((r, idx) => (idx === i ? { ...r, qtyPerUnit: parseFloat(e.target.value || "0") } : r)))}
                    />
                    <button
                      type="button"
                      onClick={() => setBom((rows) => rows.filter((_, idx) => idx !== i))}
                      className="px-2 text-lg text-red-500 hover:text-red-700"
                      aria-label="Remove material row"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={() => setBom((rows) => [...rows, { materialId: "", qtyPerUnit: 1 }])}>
                  + Add material
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* ── Sidebar column ──────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-1 lg:self-start">
          <Card title="Status & category">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Status</label>
                <select className={`${fieldClass} mt-1`} value={status} onChange={(e) => setStatus(e.target.value)}>
                  {["DRAFT", "ACTIVE", "ARCHIVED", "SOLD_OUT"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select className={`${fieldClass} mt-1`} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card title="Where this shows up">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                <label htmlFor="featured" className="flex-1 text-sm text-neutral-700">
                  Feature on homepage <span className="text-neutral-400">("Hand-picked")</span>
                </label>
                {featured && (
                  <input
                    type="number"
                    value={featuredOrder}
                    onChange={(e) => setFeaturedOrder(parseInt(e.target.value || "0", 10))}
                    title="Lower number shows first"
                    className="w-16 rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" id="inLookbook" checked={inLookbook} onChange={(e) => setInLookbook(e.target.checked)} />
                <label htmlFor="inLookbook" className="flex-1 text-sm text-neutral-700">Include in Lookbook</label>
                {inLookbook && (
                  <input
                    type="number"
                    value={lookbookOrder}
                    onChange={(e) => setLookbookOrder(parseInt(e.target.value || "0", 10))}
                    title="Lower number shows first"
                    className="w-16 rounded-sm border border-neutral-300 px-2 py-1 text-sm"
                  />
                )}
              </div>
              <p className="text-xs leading-snug text-neutral-400">
                The number controls order — lower shows first. Leave both off and the homepage/lookbook will just show your most recent pieces automatically.
              </p>
              <div className="flex items-center gap-2 border-t border-neutral-100 pt-4">
                <input type="checkbox" className="h-4 w-4" id="preOrder" checked={preOrder} onChange={(e) => setPreOrder(e.target.checked)} />
                <label htmlFor="preOrder" className="text-sm text-neutral-700">
                  Open for pre-order <span className="text-neutral-400">(PDP shows "Reserve" instead of "Add to bag")</span>
                </label>
              </div>
            </div>
          </Card>

          <Card title="Pricing">
            <div className="space-y-4">
              <div className="grid grid-cols-[auto_1fr] items-end gap-3">
                <div>
                  <label className={labelClass}>Color</label>
                  <div
                    className="mt-1 h-10 w-10 rounded-sm border border-neutral-300"
                    style={{ background: colorHex || "#ffffff" }}
                  />
                </div>
                <div>
                  <input className={`${fieldClass} mt-1`} value={colorHex} onChange={(e) => setColorHex(e.target.value)} placeholder="#8A7A6A" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Color name</label>
                <input className={`${fieldClass} mt-1`} value={colorName} onChange={(e) => setColorName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Base price (₹)</label>
                  <input className={`${fieldClass} mt-1`} type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Discount %</label>
                  <input className={`${fieldClass} mt-1`} type="number" min={0} max={99} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="e.g. 25" />
                </div>
              </div>
              {discountPercent && parseFloat(discountPercent) > 0 && (
                <p className="text-xs text-neutral-500">
                  Storefront shows{" "}
                  <s>₹{Math.round(parseFloat(basePrice || "0") / (1 - parseFloat(discountPercent) / 100)).toLocaleString("en-IN")}</s>{" "}
                  ₹{parseFloat(basePrice || "0").toLocaleString("en-IN")}{" "}
                  <span className="text-emerald-700">({discountPercent}% off)</span>
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4">
                <div>
                  <label className={labelClass}>Cost price (₹)</label>
                  <input className={`${fieldClass} mt-1`} type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="Landed cost" />
                </div>
                <div>
                  <label className={labelClass}>Vendor cost (₹)</label>
                  <input className={`${fieldClass} mt-1`} type="number" value={vendorCost} onChange={(e) => setVendorCost(e.target.value)} placeholder="If different" />
                </div>
              </div>
              <p className="text-[11px] text-neutral-400">Cost fields drive margin reporting — they're never shown to customers.</p>
            </div>
          </Card>

          <Card title="Vendor & inventory">
            <div className="space-y-4">
              {isAdmin && (
                <div>
                  <label className={labelClass}>Vendor</label>
                  <select className={`${fieldClass} mt-1`} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className={labelClass}>Stock by size</label>
                <div className="mt-1 flex gap-2">
                  {SIZES.map((s) => (
                    <div key={s} className="text-center">
                      <div className="mb-1 text-[10px] font-medium text-neutral-400">{s}</div>
                      <input
                        type="number"
                        className="w-12 rounded-sm border border-neutral-300 px-1.5 py-1.5 text-center text-sm"
                        value={stock[s]}
                        onChange={(e) => setStock((st) => ({ ...st, [s]: parseInt(e.target.value || "0", 10) }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-neutral-100 pt-4">
                <label className={labelClass}>Fabric tiers (price add in ₹)</label>
                <div className="mt-1 space-y-2">
                  {tiers.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className={`${fieldClass} flex-1`}
                        value={t.label}
                        onChange={(e) => setTiers((ts) => ts.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
                      />
                      <input
                        className={`${fieldClass} w-20`}
                        type="number"
                        value={t.priceAdd}
                        onChange={(e) => setTiers((ts) => ts.map((x, idx) => (idx === i ? { ...x, priceAdd: parseFloat(e.target.value || "0") } : x)))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-8 mt-6 border-t border-neutral-200 bg-white/95 px-8 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          {error && <span className="text-xs text-red-600">Check the error above.</span>}
        </div>
      </div>
    </form>
  );
}
