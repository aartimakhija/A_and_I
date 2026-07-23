// Digital Garment Passport (Trust layer) — public page a QR/NFC scan resolves to.
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
export default async function Passport({ params }: { params: { serial: string } }) {
  const p = await prisma.passport.findUnique({
    where: { serial: params.serial },
    include: { orderItem: { include: { product: { include: { vendor: true } } } } },
  });
  if (!p) notFound();
  const prod = p.orderItem.product;
  return (
    <main style={{ padding: 40, maxWidth: 640 }}>
      <h1>{prod.name}</h1>
      <p><strong>Serial:</strong> {p.serial}</p>
      <p><strong>Designer:</strong> {p.designer}</p>
      <p><strong>Atelier:</strong> {prod.vendor.name}</p>
      <p><strong>Material origin:</strong> {p.materialOrigin}</p>
      <p><strong>Made:</strong> {p.madeAt ?? "Made to order in India"}</p>
      <p style={{ color: "#878787" }}>Authenticity verified · A & I garment passport</p>
    </main>
  );
}
