"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Eyebrow, Title, TiltCard } from "./primitives";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

type Post = {
  title: string; subtitle: string | null; coverImage: string | null; body: string;
  authorName: string; publishedAt: string | null; updatedAt?: string;
};

export function BlogPostView({ post, products }: { post: Post; products: SFProduct[] }) {
  const router = useRouter();
  const { rm } = useStore();
  const paragraphs = post.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const showUpdated = post.updatedAt && post.publishedAt && new Date(post.updatedAt).toDateString() !== new Date(post.publishedAt).toDateString();

  return (
    <article>
      <header style={{ textAlign: "center", padding: "clamp(40px,6vw,72px) 24px clamp(24px,4vw,40px)", maxWidth: 760, margin: "0 auto" }}>
        <Eyebrow>Journal</Eyebrow>
        <Title as="h1" size="clamp(30px,5vw,54px)" style={{ marginTop: 10 }}>{post.title}</Title>
        {post.subtitle && <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>{post.subtitle}</p>}
        <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginTop: 20 }}>
          {post.authorName}{post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}
          {showUpdated && ` · Updated ${new Date(post.updatedAt!).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
        </div>
      </header>

      {post.coverImage && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <img src={post.coverImage} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(36px,6vw,64px) 24px" }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontFamily: SANS, fontWeight: 300, fontSize: 16.5, lineHeight: 1.9, color: T.ink, marginBottom: 24 }}>{p}</p>
        ))}
      </div>

      {products.length > 0 && (
        <section style={{ background: T.card, padding: "clamp(48px,7vw,90px) clamp(20px,4vw,48px)" }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <Eyebrow>As seen in this story</Eyebrow>
              <Title size="clamp(24px,3.4vw,38px)" style={{ marginTop: 10 }}>Shop <span style={{ fontStyle: "italic", color: T.gold }}>this post.</span></Title>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="grid-4">
              {products.map((p) => (
                <TiltCard rm={rm} key={p.id}>
                  <ProductCard product={p} />
                </TiltCard>
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
