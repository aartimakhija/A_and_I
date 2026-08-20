"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Eyebrow, Title, TiltCard } from "./primitives";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

type Post = {
  title: string; subtitle: string | null; coverImage: string | null; body: string;
  authorName: string; publishedAt: string | null; updatedAt?: string; category?: string | null;
};
type RelatedPost = { slug: string; title: string; coverImage: string | null; publishedAt: string | null };

export function BlogPostView({ post, products, related }: { post: Post; products: SFProduct[]; related?: RelatedPost[] }) {
  const router = useRouter();
  const { rm } = useStore();
  const paragraphs = post.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const showUpdated = post.updatedAt && post.publishedAt && new Date(post.updatedAt).toDateString() !== new Date(post.publishedAt).toDateString();
  // Embed the shoppable strip at the natural midpoint of the body, matching
  // the Kindred spec's "named products placed inline within the article
  // flow" — not just bolted on at the very end as an afterthought.
  const mid = Math.ceil(paragraphs.length / 2);
  const firstHalf = paragraphs.slice(0, mid);
  const secondHalf = paragraphs.slice(mid);

  return (
    <article>
      {/* EditorialHero — split layout, distinct from the full-bleed CampaignHero used on Home */}
      <header style={{ display: "grid", gridTemplateColumns: post.coverImage ? "1fr 1fr" : "1fr", background: T.card }} className="grid-2">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,6vw,72px)" }}>
          <Eyebrow>{post.category || "Journal"}</Eyebrow>
          <Title as="h1" size="clamp(30px,4.6vw,52px)" style={{ marginTop: 10 }}>{post.title}</Title>
          {post.subtitle && <p style={{ fontFamily: SANS, fontStyle: "italic", fontWeight: 300, color: T.mid, fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>{post.subtitle}</p>}
          <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginTop: 22 }}>
            {post.authorName}{post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}
            {showUpdated && ` · Updated ${new Date(post.updatedAt!).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
          </div>
        </div>
        {post.coverImage && (
          <div style={{ minHeight: 340 }}>
            <img src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(36px,6vw,64px) 24px 0" }}>
        {firstHalf.map((p, i) => (
          <p key={i} style={{ fontFamily: SANS, fontWeight: 300, fontSize: 16.5, lineHeight: 1.9, color: T.ink, marginBottom: 24 }}>{p}</p>
        ))}
      </div>

      {products.length > 0 && (
        <section style={{ background: T.card, padding: "clamp(32px,5vw,56px) clamp(20px,4vw,48px)", margin: "clamp(24px,4vw,40px) 0" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <Eyebrow>Featured in this story</Eyebrow>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(products.length, 3)},1fr)`, gap: 16, marginTop: 16 }} className="grid-3">
              {products.slice(0, 3).map((p) => (
                <TiltCard rm={rm} key={p.id}>
                  <ProductCard product={p} />
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px clamp(36px,6vw,64px)" }}>
        {secondHalf.map((p, i) => (
          <p key={i} style={{ fontFamily: SANS, fontWeight: 300, fontSize: 16.5, lineHeight: 1.9, color: T.ink, marginBottom: 24 }}>{p}</p>
        ))}
      </div>

      {products.length > 3 && (
        <section style={{ padding: "0 clamp(20px,4vw,48px) clamp(48px,7vw,90px)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <Eyebrow>More from this story</Eyebrow>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginTop: 16 }} className="grid-4">
              {products.slice(3).map((p) => (
                <TiltCard rm={rm} key={p.id}>
                  <ProductCard product={p} />
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {related && related.length > 0 && (
        <section style={{ background: T.card, padding: "clamp(48px,7vw,90px) clamp(20px,4vw,48px)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Eyebrow>Keep reading</Eyebrow>
              <Title size="clamp(24px,3.4vw,38px)" style={{ marginTop: 10 }}>Related <span style={{ fontStyle: "italic", color: T.gold }}>stories.</span></Title>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(related.length, 3)},1fr)`, gap: 24 }} className="grid-3">
              {related.map((r) => (
                <button key={r.slug} onClick={() => router.push(`/blog/${r.slug}`)} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <div style={{ aspectRatio: "4/3", overflow: "hidden", background: T.darkCard }}>
                    {r.coverImage && <img src={r.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ padding: "14px 2px" }}>
                    {r.publishedAt && <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 6 }}>
                      {new Date(r.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>}
                    <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 18, color: T.ink }}>{r.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div style={{ textAlign: "center", padding: "clamp(32px,5vw,56px) 24px" }}>
        <button onClick={() => router.push("/blog")} style={{ background: "none", border: "none", cursor: "pointer",
          fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.stone, borderBottom: `1px solid ${T.border}`, paddingBottom: 3 }}>
          ← Back to the Journal
        </button>
      </div>
    </article>
  );
}
