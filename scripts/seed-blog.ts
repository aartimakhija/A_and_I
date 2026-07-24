// scripts/seed-blog.ts
//
// Creates 5 real Journal posts, each tagged to a real product from the
// catalogue (so "Shop this post" on the live page actually has something to
// show). Looks products up by slug at run time rather than hardcoding IDs,
// so it works regardless of when/how your catalogue was seeded.
//
// Run:  npx tsx scripts/seed-blog.ts

import { config } from "dotenv";
config({ path: "prisma/.env" });
config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "the-art-of-bandhani",
    productSlug: "emerald-authority",
    title: "The Art of Bandhani, and Why It Takes Weeks, Not Hours",
    subtitle: "Behind the tie-dye technique that shapes our Emerald Authority piece.",
    body: `Bandhani is one of India's oldest resist-dyeing techniques, and one of the slowest. Before a single drop of dye touches the fabric, an artisan pinches tiny sections of cloth and ties each one off by hand with thread — sometimes thousands of tiny knots across a single length of fabric.

Each knot resists the dye when the cloth is submerged, leaving behind the small, precise dots that give bandhani its signature texture. Untie every knot afterward, by hand, and the pattern reveals itself — never quite identical twice, which is exactly the point.

For Emerald Authority, we worked with our Jaipur atelier to apply this technique across a silhouette built for right now rather than for tradition's sake alone. The deep emerald base was chosen specifically because it holds the dye's resist pattern with unusual clarity — lighter colors can wash the detail out.

A finished piece like this represents days of tying, dyeing, and untying before it's ever cut and sewn. That's also why bandhani pieces are never mass-produced in our collection — the technique simply doesn't scale, and we think that's a feature, not a limitation.

If you're drawn to pieces with real handwork behind them, this is where to start.`,
  },
  {
    slug: "styling-sage-ceremony-for-a-wedding-guest",
    productSlug: "sage-ceremony",
    title: "What to Wear as a Wedding Guest: Styling Sage & Ceremony",
    subtitle: "One piece, three ways to wear it — from daytime mehndi to evening reception.",
    body: `Wedding-guest dressing has one real challenge: you need something that photographs well, moves easily through a full day of events, and doesn't compete with the people actually getting married. Sage & Ceremony was built with exactly that brief in mind.

For a daytime function — mehndi, haldi, or a garden ceremony — wear it as designed, with minimal jewellery. The craft detailing does enough work on its own; a single pair of earrings and a light hand is all it needs.

Moving into an evening reception, the same piece takes a stacked gold cuff and a heavier earring well. Swap flats for a block heel and you've shifted the whole mood without changing the outfit.

If the venue calls for something warmer, a light shawl in a complementary tone — champagne or soft gold — layers over the shoulders without hiding the neckline detail.

The honest test of any wedding-guest piece is whether you'd reach for it again outside of wedding season. This one holds up as a dinner-out dress just as easily as a ceremony outfit — which is really the standard we hold everything in the collection to.`,
  },
  {
    slug: "why-linen-is-different-fabric-story",
    productSlug: "undone-in-linen",
    title: "Why Linen Behaves Differently — A Fabric Story",
    subtitle: "The material behind Undone in Linen, and how to actually care for it.",
    body: `Linen is one of the oldest textiles in the world, woven from the fibres of the flax plant, and it behaves nothing like cotton — even though the two are often shelved together.

Flax fibre is naturally stiffer and less elastic than cotton, which is exactly why linen creases the way it does. That crease isn't a flaw to iron away entirely; it's part of what makes linen look intentional rather than synthetic, even after a full day of wear.

It's also genuinely better suited to heat than most fabrics. Linen fibres are hollow, which lets air move through the weave far more freely than a tighter cotton weave allows — part of why it's remained a warm-climate staple for thousands of years, India included.

Undone in Linen is cut deliberately loose, letting the fabric's natural drape do the work instead of fighting it with structure. Fitted linen has to fight the fibre's stiffness; loose linen works with it.

Caring for it is simpler than people expect: a cool hand wash or gentle machine cycle, and hang to dry rather than tumble — heat is the one thing that shortens a linen garment's life. Skip the iron entirely if you like the lived-in look; a light steam is enough if you don't.`,
  },
  {
    slug: "mirror-work-amber-and-mirrors",
    productSlug: "amber-mirrors",
    title: "Mirror-Work, Explained: The Craft Behind Amber & Mirrors",
    subtitle: "How shisha embroidery is actually done, disc by disc.",
    body: `Mirror-work — known as shisha embroidery in much of India — is one of those techniques that looks decorative from a distance and looks like real engineering up close.

Each small mirror disc is held in place not by glue, but by a web of thread stitched around its edge in a specific sequence: a foundation grid first, then a finer interlace on top that locks the disc in from every direction. Pull on one thread and the whole structure resists — that's the actual function of the technique, not just its look.

For Amber & Mirrors, our Kutch atelier — the region most associated with this craft — placed each disc individually across the bodice, meaning no two pieces in the run have identical mirror placement. What looks uniform from a few feet away is, up close, entirely handmade variation.

The amber and warm-brown palette was chosen deliberately: mirror-work traditionally sits on darker, richer grounds in Kutch textile tradition, where the metallic glint of the discs contrasts hardest against a deep base color.

It's a piece that rewards a closer look — which, if we're honest, is true of most things worth having.`,
  },
  {
    slug: "one-piece-five-ways-gold-hour",
    productSlug: "gold-hour",
    title: "One Piece, Five Ways: Getting the Most Out of Gold Hour",
    subtitle: "A styling guide for the piece that should earn its space in your wardrobe.",
    body: `We think a lot about "cost per wear" when we design — not in a spreadsheet sense, but in whether a piece actually gives you enough different looks to justify owning it. Gold Hour was built around that question directly.

For daytime, wear it as-is with flat sandals and minimal jewellery — the color does enough of the work on its own to not need competing accessories.

Layer a structured jacket or blazer over it for a work-appropriate silhouette; the warm tone reads sophisticated rather than casual once it's under tailoring.

For evening, swap in a strappy heel and a single statement earring. The same piece reads completely differently once the accessories shift register.

In cooler weather, a fitted turtleneck underneath extends the piece into another season entirely, rather than packing it away.

And if you're travelling, it's one of the least demanding pieces to pack — it resists creasing better than most of our craft pieces, precisely because of how it's constructed.

Five ways isn't a marketing number here; it's genuinely how many distinct outfits we tested before deciding this piece belonged in the collection at all.`,
  },
];

async function main() {
  let created = 0, skipped = 0;
  for (const post of POSTS) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) { console.log(`  = ${post.slug} already exists, skipping`); skipped++; continue; }

    const product = await prisma.product.findUnique({ where: { slug: post.productSlug }, include: { images: { orderBy: { position: "asc" }, take: 1 } } });
    if (!product) { console.warn(`  ! product "${post.productSlug}" not found — creating post without a cover image or tag`); }

    await prisma.blogPost.create({
      data: {
        slug: post.slug, title: post.title, subtitle: post.subtitle, body: post.body,
        coverImage: product?.images[0]?.url ?? null,
        status: "PUBLISHED", publishedAt: new Date(), authorName: "A & I Editorial",
        products: product ? { create: [{ productId: product.id, position: 0 }] } : undefined,
      },
    });
    console.log(`  + ${post.slug} (tagged: ${product?.name ?? "none"})`);
    created++;
  }
  console.log(`Done. Created ${created}, skipped ${skipped} already-existing.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
