import { prisma } from "@/lib/prisma";
import { toSFProduct, PRODUCT_INCLUDE } from "@/lib/storefront-adapter";
import { About } from "@/components/storefront/About";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description: "The story behind A&I — how a shared closet frustration became a house built on curation, craft, and trust over trend.",
  path: "/about",
});

const FAQS = [
  { question: "Where are A&I pieces made?", answer: "Every piece is made in India, in small runs, by named ateliers in Jaipur and Kutch — never mass-produced." },
  { question: "What fabric tiers are available?", answer: "Most pieces offer three tiers: Signature linen (included), Premium handloom, and Hand-embroidered couture, each an upgrade in fabric and finishing." },
  { question: "Do you restock sold-out pieces?", answer: "No — every piece is a limited run. Once it sells out, it's gone, though you can join the waitlist to be notified if a restock happens." },
  { question: "How do I know my size?", answer: "Take our two-minute Fit Quiz — no measuring tape needed — and we'll recommend a size across the whole collection." },
];

export default async function AboutPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const all = products.map(toSFProduct);
  const originPiece = all.find((p) => p.category === "craft") ?? all[0] ?? null;
  const processPieces = all.filter((p) => p.id !== originPiece?.id).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])) }} />
      <About originPiece={originPiece} processPieces={processPieces} pieceCount={all.length} faqs={FAQS} />
    </>
  );
}
