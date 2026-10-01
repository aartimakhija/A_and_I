"use client";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/site/ProductCard";
import type { SFProduct } from "@/lib/storefront-adapter";
import { parseBlogBody, parseInline, type BlogBlock } from "@/lib/blog-content";

type Post = {
  title: string; subtitle: string | null; coverImage: string | null; body: string;
  authorName: string; authorUrl?: string | null; publishedAt: string | null; updatedAt?: string; category?: string | null;
};
type RelatedPost = { slug: string; title: string; coverImage: string | null; publishedAt: string | null };

function dateLabel(iso: string | Date | null | undefined) {
  return iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;
}

function Prose({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((seg, i) =>
        seg.href ? (
          <Link key={i} href={seg.href} className="link-underline text-foreground">
            {seg.text}
          </Link>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

function Block({ block, i }: { block: BlogBlock; i: number }) {
  if (block.type === "h2") {
    return (
      <h2 key={i} className="display-md mt-14 first:mt-0">
        {block.text}
      </h2>
    );
  }
  if (block.type === "qa") {
    // A visually distinct "quick answer" card — the same content this also
    // feeds into FAQPage structured data (see the [slug]/page.tsx reader):
    // short, direct, extractable by a snippet or an AI answer engine, not
    // just a human scrolling.
    return (
      <div key={i} className="mt-10 border-l-2 border-primary/40 pl-6 first:mt-0">
        <h3 className="display-md text-lg">{block.question}</h3>
        {block.answer.split(/\n\s*\n/).map((p, j) => (
          <p key={j} className="mt-3 text-muted-foreground first:mt-3">
            {p}
          </p>
        ))}
      </div>
    );
  }
  return (
    <p key={i} className="mt-7 text-muted-foreground first:mt-0">
      <Prose text={block.text} />
    </p>
  );
}

export function BlogPostView({ post, products, related }: { post: Post; products: SFProduct[]; related?: RelatedPost[] }) {
  const blocks = parseBlogBody(post.body);
  const showUpdated = post.updatedAt && post.publishedAt && new Date(post.updatedAt).toDateString() !== new Date(post.publishedAt).toDateString();
  // Embed the shoppable strip at the natural midpoint of the body, matching
  // the Kindred spec's "named products placed inline within the article
  // flow" — not just bolted on at the very end as an afterthought.
  const mid = Math.ceil(blocks.length / 2);
  const firstHalf = blocks.slice(0, mid);
  const secondHalf = blocks.slice(mid);

  return (
    <article>
      <section className="shell max-w-3xl py-20">
        <p className="eyebrow">
          {post.category || "Journal"}
          {dateLabel(post.publishedAt) && ` · ${dateLabel(post.publishedAt)}`}
        </p>
        <h1 className="display-xl mt-6">{post.title}</h1>
        {post.subtitle && <p className="mt-7 text-lg text-muted-foreground">{post.subtitle}</p>}
        <p className="micro mt-6 text-muted-foreground">
          {post.authorUrl ? (
            <Link href={post.authorUrl} className="link-underline">
              {post.authorName}
            </Link>
          ) : (
            post.authorName
          )}
          {showUpdated && ` · Updated ${dateLabel(post.updatedAt)}`}
        </p>
      </section>

      {post.coverImage && (
        <div className="shell">
          <div className="relative aspect-16/10 w-full overflow-hidden bg-secondary">
            <Image src={post.coverImage} alt={post.title} fill sizes="100vw" className="object-cover" priority />
          </div>
        </div>
      )}

      <section className="shell max-w-2xl py-20">
        {firstHalf.map((b, i) => (
          <Block key={i} block={b} i={i} />
        ))}
      </section>

      {products.length > 0 && (
        <section className="border-y border-border bg-card py-16">
          <div className="shell max-w-4xl">
            <p className="eyebrow">Featured in this story</p>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {secondHalf.length > 0 && (
        <section className="shell max-w-2xl py-20">
          {secondHalf.map((b, i) => (
            <Block key={i} block={b} i={i} />
          ))}
        </section>
      )}

      {products.length > 3 && (
        <section className="shell pb-20">
          <p className="eyebrow">More from this story</p>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
            {products.slice(3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {related && related.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="shell py-20">
            <p className="eyebrow">Keep reading</p>
            <h2 className="display-lg mt-5">
              Related <span className="gold-italic">stories.</span>
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                  <div className="card-zoom relative aspect-4/3 overflow-hidden bg-secondary">
                    {r.coverImage && <Image src={r.coverImage} alt={r.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />}
                  </div>
                  {dateLabel(r.publishedAt) && <p className="eyebrow mt-5">{dateLabel(r.publishedAt)}</p>}
                  <h3 className="display-md mt-3 text-xl group-hover:text-primary">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="shell py-14 text-center">
        <Link href="/blog" className="link-underline micro text-muted-foreground">
          ← Back to the journal
        </Link>
      </div>
    </article>
  );
}
