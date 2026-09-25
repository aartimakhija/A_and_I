"use client";
import Link from "next/link";
import Image from "next/image";

type Post = { id: string; slug: string; title: string; subtitle: string | null; coverImage: string | null; authorName: string; publishedAt: string | null };

function dateLabel(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
}

export function BlogList({ posts }: { posts: Post[] }) {
  const [lead, ...rest] = posts;

  return (
    <>
      <section className="shell py-20">
        <p className="eyebrow">Notes from the studio</p>
        <h1 className="display-xl mt-6">
          The <span className="gold-italic">journal.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          Craft notes, styling edits, and the stories behind the pieces — from the A&amp;I studio.
        </p>
      </section>

      {posts.length === 0 && (
        <p className="shell pb-24 text-muted-foreground">Nothing published yet — check back soon.</p>
      )}

      {lead && (
        <section className="shell pb-20">
          <Link href={`/blog/${lead.slug}`} className="group grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="card-zoom relative aspect-4/3 overflow-hidden bg-secondary">
              {lead.coverImage && <Image src={lead.coverImage} alt={lead.title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" priority />}
            </div>
            <div>
              <p className="eyebrow">
                {dateLabel(lead.publishedAt)} · {lead.authorName}
              </p>
              <h2 className="display-lg mt-5 group-hover:text-primary">{lead.title}</h2>
              {lead.subtitle && <p className="mt-6 text-muted-foreground">{lead.subtitle}</p>}
              <span className="link-underline micro mt-8 inline-block text-primary">Read the story</span>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section className="shell grid gap-x-8 gap-y-14 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
              <div className="card-zoom relative aspect-4/5 overflow-hidden bg-secondary">
                {p.coverImage && <Image src={p.coverImage} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />}
              </div>
              <p className="eyebrow mt-5">{dateLabel(p.publishedAt)} · {p.authorName}</p>
              <h3 className="display-md mt-3 text-xl group-hover:text-primary">{p.title}</h3>
              {p.subtitle && <p className="mt-3 text-sm text-muted-foreground">{p.subtitle}</p>}
            </Link>
          ))}
        </section>
      )}

      <section className="bg-secondary">
        <div className="shell flex flex-wrap items-center justify-between gap-8 py-20">
          <h2 className="display-lg max-w-lg">
            Come see what <span className="gold-italic">we made this season.</span>
          </h2>
          <Link href="/shop/all" className="btn-solid-gold">
            Explore the collection
          </Link>
        </div>
      </section>
    </>
  );
}
