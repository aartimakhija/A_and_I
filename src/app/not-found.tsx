import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/categories";

// 404 as a merchandising surface, not a dead end — Kindred's own spec calls
// this out as a real UX strength worth reproducing: a discovery grid instead
// of just a "page not found" message.
export default async function NotFound() {
  const categories = await getCategories().catch(() => []);
  const tiles = await Promise.all(
    categories.slice(0, 6).map(async (c) => {
      const rep = await prisma.product.findFirst({
        where: { status: "ACTIVE", category: c.slug },
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      }).catch(() => null);
      return { slug: c.slug, name: c.name, image: rep?.images[0]?.url ?? null };
    })
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0D0C0B", color: "#F0EBE3", padding: "clamp(40px,7vw,80px) 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(70px,14vw,160px)", lineHeight: 1, color: "#C4A96A", fontStyle: "italic" }}>404</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: "clamp(26px,4vw,40px)", margin: "10px 0 14px" }}>
          This page wandered off the runway.
        </h1>
        <p style={{ fontFamily: "system-ui, sans-serif", fontWeight: 300, fontSize: 14, color: "rgba(240,235,227,0.6)", maxWidth: 380, margin: "0 auto", lineHeight: 1.7 }}>
          The piece you're looking for isn't here — but the rest of the collection is.
        </p>
        <Link href="/" style={{
          display: "inline-block", marginTop: 26, fontFamily: "system-ui, sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
          color: "#0D0C0B", background: "#F0EBE3", padding: "14px 34px", textDecoration: "none",
        }}>
          Return home
        </Link>
      </div>

      {tiles.some((t) => t.image) && (
        <div style={{ maxWidth: 1180, margin: "clamp(48px,7vw,90px) auto 0" }}>
          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(240,235,227,0.4)", textAlign: "center", marginBottom: 24 }}>
            Or discover something new
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
            {tiles.filter((t) => t.image).map((t) => (
              <Link key={t.slug} href={`/shop/${t.slug}`} style={{ position: "relative", display: "block", aspectRatio: "3/4", overflow: "hidden", background: "#1a1714" }}>
                <img src={t.image!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(13,12,11,0.75) 100%)" }} />
                <span style={{ position: "absolute", bottom: 12, left: 12, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontSize: 16, color: "#F0EBE3" }}>
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
