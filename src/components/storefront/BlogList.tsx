"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { Eyebrow, Title } from "./primitives";

type Post = { id: string; slug: string; title: string; subtitle: string | null; coverImage: string | null; authorName: string; publishedAt: string | null };

export function BlogList({ posts }: { posts: Post[] }) {
  const router = useRouter();

  return (
    <>
      <header style={{ textAlign: "center", padding: "clamp(48px,7vw,90px) 24px clamp(28px,4vw,48px)" }}>
        <Eyebrow>Notes from the studio</Eyebrow>
        <Title>The <span style={{ fontStyle: "italic", color: T.gold }}>Journal</span></Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: "16px auto 0" }}>
          Craft notes, styling edits, and the stories behind the pieces.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28, maxWidth: 1180, margin: "0 auto", padding: "0 clamp(20px,4vw,48px) clamp(64px,9vw,110px)" }} className="grid-3">
        {posts.map((p) => (
          <button key={p.id} onClick={() => router.push(`/blog/${p.slug}`)}
            style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ aspectRatio: "4/3", background: p.coverImage ? undefined : `linear-gradient(155deg, ${T.linen}, ${T.darkCard})`, overflow: "hidden" }}>
              {p.coverImage && <img src={p.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ padding: "16px 2px" }}>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.stone, marginBottom: 6 }}>
                {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""} · {p.authorName}
              </div>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: T.ink, lineHeight: 1.2 }}>{p.title}</div>
              {p.subtitle && <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, color: T.mid, marginTop: 8, lineHeight: 1.6 }}>{p.subtitle}</p>}
            </div>
          </button>
        ))}
      </div>
      {posts.length === 0 && <p style={{ textAlign: "center", color: T.stone, padding: "0 24px 80px" }}>Nothing published yet — check back soon.</p>}
    </>
  );
}
