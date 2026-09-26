import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { About } from "@/components/storefront/About";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description: "The story behind A&I, in founder Artee Makhija's own words — from a childhood spent designing her own clothes to building the house of considered, everyday pieces she could never find.",
  path: "/about",
});

const FAQS = [
  { question: "Where are A&I pieces made?", answer: "Every piece is made in India, in small runs, by a specialist craft partner — never mass-produced." },
  { question: "What fabric is used?", answer: "Most current pieces are 100% washed linen, chosen for how cleanly it holds a laser-cut edge without fraying. A handful of pieces use silk or organza instead, and that's always stated plainly on that piece's own product page." },
  { question: "Do you restock sold-out pieces?", answer: "No — every piece is a limited run. Once it sells out, it's gone, though you can join the waitlist to be notified if a restock happens." },
  { question: "How do I know my size?", answer: "Take our two-minute Fit Quiz — no measuring tape needed — and we'll recommend a size across the whole collection." },
];

export default async function AboutPage() {
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: PRODUCT_INCLUDE, orderBy: { createdAt: "desc" }, take: 12 }),
    prisma.product.count({ where: { status: "ACTIVE" } }), // the real total — the 12-item fetch above is only for sample imagery
  ]);
  const all = products.map(toSFProduct);
  const originPiece = all.find((p) => p.category === "craft") ?? all[0] ?? null;
  const processImage = all.find((p) => p.id !== originPiece?.id && p.category === "craft") ?? all.find((p) => p.id !== originPiece?.id) ?? null;
  const processPieces = all.filter((p) => p.id !== originPiece?.id && p.id !== processImage?.id).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])) }} />
      <About originPiece={originPiece} processImage={processImage} processPieces={processPieces} pieceCount={totalCount} faqs={FAQS} />
    </>
  );
}
