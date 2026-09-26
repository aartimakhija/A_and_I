// scripts/seed-blog.ts
//
// Journal content, kept in sync with the CURRENT live catalogue only.
//
// This script previously seeded 5 posts about the old retired catalogue
// (Emerald Authority, Sage & Ceremony, Undone in Linen, Amber & Mirrors,
// Gold Hour) — pieces that no longer exist on the site. Running an earlier
// version of this file published them by mistake. This version undoes that:
// it deletes those 5 posts by slug if they're still there, keeps the one
// general/evergreen post that's still accurate, and replaces the rest with
// posts about what's actually for sale right now — the "Architecture in
// Linen" capsule (linen fabric, the laser-cut technique, its real care
// instructions, and the real design references — Persian girih tiling,
// Bauhaus, Moorish muqarnas, Art Nouveau — that the capsule's own product
// names draw on). Every fact below is taken from the live product pages,
// not invented.
//
// Idempotent: safe to re-run. For each slug below, creates it if missing,
// and otherwise diffs the live post against the content here and updates it
// in place if it has drifted (catches stale content left over from an older
// run of this file, instead of silently skipping it forever). Only deletes
// the specific retired-catalogue slugs named below.
//
// Run:  npx tsx scripts/seed-blog.ts

import { config } from "dotenv";
config({ path: "prisma/.env" });
config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Slugs from the old (retired-catalogue) version of this script. Deleted on
// every run so a stray earlier publish doesn't linger.
const RETIRE_SLUGS = [
  "the-art-of-bandhani",
  "styling-sage-ceremony-for-a-wedding-guest",
  "why-linen-is-different-fabric-story",
  "mirror-work-amber-and-mirrors",
  "one-piece-five-ways-gold-hour",
];

const POSTS = [
  {
    slug: "why-linen-anchors-architecture-in-linen",
    productSlug: "architecture-in-linen-look-157-linen-waistcoat-palazzo-set",
    title: "Why Linen Anchors Architecture in Linen",
    subtitle: "The fabric behind the capsule's name, and why it was the only real choice for laser-cut geometry.",
    body: `Every piece in Architecture in Linen starts as a drawing before it's a garment — a line, a proportion, a piece of geometry worked out before any cloth is chosen. But the cloth was never really optional. Once the design language settled on cutwork — precise, laser-cut openings that have to hold their shape rather than fray — linen was the fabric that made the idea possible at all.

Linen is woven from flax fibre, and flax behaves nothing like cotton even though the two get shelved together. The fibre itself is stiffer and less elastic, which is exactly what a cut edge needs: a looser, softer weave would curl or fray the moment a geometric opening was cut into it. Linen's tighter, more structured hand holds a clean edge, especially once that edge is hand-finished the way every piece in this capsule is.

It also drapes with intention rather than clinging, which matters for a capsule built on architectural silhouettes — wide-leg trousers, structured waistcoats, column gowns. The weight of linen lets a wide leg fall in a straight, deliberate line instead of collapsing, and lets a fitted bodice keep its shape without needing heavy interfacing underneath.

There's a practical side too: linen's natural fibre is hollow, which is part of why it's stayed a warm-climate staple for thousands of years. For clothing meant to be worn, not just photographed, that's not a small thing.

None of this is why linen ended up in the capsule's name by accident. It's the fabric the whole idea depended on.`,
  },
  {
    slug: "how-to-care-for-laser-cut-linen",
    productSlug: "architecture-in-linen-look-06-sculptural-wide-leg-girih-linen-jumpsuit",
    title: "How to Care for Laser-Cut Linen",
    subtitle: "The real care instructions for Architecture in Linen — not generic linen advice, but what actually protects a cut edge.",
    body: `Most linen care advice online is written for plain-woven linen — a shirt, a tablecloth, something with no cut edges to worry about. Architecture in Linen is a different kind of garment: every piece carries laser-cut geometric openings, hand-finished one edge at a time, and that changes what "taking care of it" actually means.

Dry cleaning is what we recommend first, specifically because it protects those laser-cut edges better than any home method can. A professional dry clean doesn't agitate the fabric the way a wash cycle does, so the cut openings keep their shape instead of working themselves looser over time.

If you do want to hand wash a piece, cold water only, and lay it flat to dry rather than hanging it — hanging a wet garment lets its own weight stretch the cut sections out of shape. Never wring it. Twisting linen while it's wet is the single fastest way to distort a laser-cut pattern permanently.

Ironing needs the same care. Use a cool iron, and press around the cutwork rather than directly on top of it — direct heat and pressure on an open, cut section can flatten or warp the edge instead of just smoothing a crease.

Store pieces folded, or on a padded hanger rather than a thin wire one, which can leave shoulder marks or stress a seam over time. And one thing that's actually good news: the enzyme-washed finish on these pieces is designed to soften further the more you wear it — unlike most "handle with care" instructions, wear is not the enemy here. Bad laundering is.

None of this is generic advice. It's exactly what's listed on every product page in this capsule, because the construction is genuinely different from a plain linen piece.`,
  },
  {
    slug: "girih-the-geometry-behind-our-cutwork",
    productSlug: "architecture-in-linen-look-05-deep-v-keyhole-girih-wrap-gown",
    title: "Girih: The Geometry Behind Our Cutwork",
    subtitle: "The centuries-old tiling pattern that anchors Architecture in Linen, explained.",
    body: `"Girih" is a Persian word for knot, and it names one of the oldest systematic design languages in architecture: a method for building complex, interlocking star-and-polygon patterns from a small set of simple tile shapes, repeated and rotated according to strict geometric rules. It shows up across centuries of Islamic architecture — tilework on mosques, madrasas and palaces from Iran to Central Asia — long before anyone had a word for "parametric design," even though that's essentially what it is.

The appeal for a cutwork capsule is almost too on-the-nose: girih was never decoration applied on top of a surface. It's structural logic that happens to be beautiful — the pattern IS the geometry holding itself together, which is exactly what a laser-cut garment edge needs to be. A wrap gown's rosette cage midriff, a jumpsuit's star fretwork bodice — these aren't girih patterns printed onto fabric, they're girih patterns cut as openings, so the logic of the tiling is doing structural work on the body the same way it does on a wall.

Reworking a centuries-old tiling tradition as laser-cut fabric is a genuinely different execution of an old idea, not a redraw of it: precision laser-cutting achieves a level of geometric accuracy that hand-carved stone or hand-cut tile never aimed for, and every edge is then hand-finished by a specialist craft partner so the pattern holds its shape wear after wear instead of fraying at the open edges the way a lesser cut would.

Girih is the throughline across most of Architecture in Linen, even where a specific piece borrows from a different tradition — Bauhaus grids, Moorish muqarnas, Art Nouveau line work all appear across the capsule too, each one a different answer to the same question girih poses: what happens when geometry becomes the garment, instead of just decorating it.`,
  },
  {
    slug: "beyond-girih-bauhaus-moorish-and-art-nouveau",
    productSlug: "architecture-in-linen-look-121-moorish-muqarnas-cutwork-caftan",
    title: "Beyond Girih: Bauhaus, Moorish Arches, and Art Nouveau in One Capsule",
    subtitle: "Architecture in Linen draws on more than one design tradition — here's what's actually in it.",
    body: `Girih tiling is the anchor of Architecture in Linen, but it isn't the only architectural language in the capsule. Look closely at the names across the collection and three more real design traditions show up, each reworked the same way — as laser-cut openings rather than surface print.

Moorish muqarnas is the one with the most physical presence. Muqarnas are the honeycomb-like, stalactite vaulting you see in the ceilings and archways of Moorish and wider Islamic architecture — a way of transitioning between a square room and a round dome using tiers of small, sculptural niches. The capsule's caftan borrows the pointed-arch geometry that muqarnas structures are built from, translated into a cutwork panel rather than carved plaster.

Bauhaus is the odd one out chronologically — a 20th-century German design movement, not a centuries-old tradition — but it belongs here for the same reason the others do: Bauhaus design reduced form to grids, right angles and primary structure, stripping ornament down to what the geometry itself could do. A grid cutwork leg on a jumpsuit is a fairly literal translation of that idea into fabric.

Art Nouveau runs in the opposite direction — organic, flowing vine and line work rather than rigid geometry — and its presence in the capsule (a cutwork gown built around vine-like line patterning) is the clearest sign that "Architecture in Linen" isn't only about hard angles. It's about architectural thinking generally: patterns with real structural logic behind them, whichever era or geography they come from.

Four traditions, one technique. That's the actual range of the capsule, not just the name on the label.`,
  },
  {
    slug: "what-shortlisted-means-reserving-a-piece",
    productSlug: "architecture-in-linen-look-01-asymmetric-one-shoulder-girih-cutwork-gown",
    title: "From Sketch to Shortlist: What \"Reserve\" Actually Means Right Now",
    subtitle: "Every piece in Architecture in Linen is a shortlisted design, not a finished garment sitting in stock. Here's what that means for you.",
    body: `Every product page in Architecture in Linen carries the same honest label: shortlisted design, not yet in production. It's worth explaining plainly what that means, because it changes what you're actually doing when you reserve a piece.

A shortlisted design has been through the first real stage of the process — the proportion and silhouette settled, the cutwork pattern drawn and placed, a colourway chosen — before a single unit has been cut. What you're seeing on the site is that finished design, not a finished garment. No fit-model notes exist yet for these pieces, and the exact composition and care specifics are confirmed only once the cloth is actually cut, because that's genuinely when they become final.

Reserving a piece takes no payment. It's a size and an intent, nothing more — a way of telling us which of the shortlisted designs actually deserve to become real, physical runs. We only go into production once enough people have reserved a given piece, which is the same logic behind pre-orders generally, just applied earlier in the process than most brands apply it: most places take your money for something already made. This capsule asks for your interest in something not yet cut, and gives you an early-access discount for telling us before it exists.

If a piece you've reserved doesn't get enough interest to justify a run, you're never charged, and we'd rather tell you that honestly than let a design sit in limbo. If it does move forward, the specialist craft partner who executes the cutwork takes over from there — the hands that decide how a seam sits, where an edge is turned, and when a piece is actually finished.

It's a slower way to launch a collection than filling a warehouse and hoping. It's also the only way we know to make sure nothing in the capsule gets made that nobody actually wanted.`,
  },
  {
    slug: "the-story-of-linen-flax-to-finished-cloth",
    productSlug: "architecture-in-linen-look-02-sculptural-halterneck-girih-backless-midi-dress",
    title: "The Story of Linen: From Flax Plant to Finished Cloth",
    subtitle: "Before it was a capsule name, linen was one of the oldest fabrics humans have ever made. Here's the fibre itself.",
    body: `Linen doesn't start as a fabric at all — it starts as flax, a slim blue-flowering plant grown for its stalk rather than its bloom. The fibre comes from inside that stalk: after harvest, the stalks are laid out and left to "ret," a controlled rotting that loosens the woody outer layer from the long fibres inside. Those fibres are then combed out, spun into yarn, and woven into cloth — a process that's changed in scale and machinery over the centuries, but not much in principle.

It's also one of the oldest textiles people have made. Linen fragments have turned up in Neolithic dig sites, and it was the fabric of choice in ancient Egypt for everything from everyday clothing to the wrappings used in mummification — chosen then, as now, for how cool and breathable it is against skin in a hot climate. Few fabrics have stayed in continuous use for quite that long.

The properties that made it useful thousands of years ago are the same ones that make it useful in a garment today. Flax fibre is naturally hollow, which lets air move through the weave and moisture evaporate quickly — part of why linen has stayed a warm-weather staple across so many cultures. It's also a relatively stiff, strong fibre compared to cotton, which is exactly why it holds a crisp edge well: a looser, more elastic weave would soften or fray at a cut line, where linen's structure holds.

Linen creases easily, and that's worth saying plainly rather than treating it as a flaw to hide. A crease in linen has always read as a sign of a natural fibre being worn and lived in, not a laundering failure — closer to how a leather bag develops character than how a synthetic fabric is expected to stay flat. It also genuinely softens with every wash, which is part of why a well-cared-for linen piece tends to get more comfortable, not less, over years of wear.

None of this is really about any one capsule — it's just what the fibre is. Our own use of it, and the exact care that keeps a laser-cut edge intact, is covered separately in how we work with it. This is the plainer story: what linen is, and why it's been worth using for as long as people have been making cloth at all.`,
  },
  {
    slug: "how-pre-order-actually-works",
    productSlug: null,
    title: "How Pre-Order Actually Works at A&I",
    subtitle: "No payment up front, no minimum order size games — just how small-run manufacturing actually happens.",
    body: `Most pre-order systems online are really just a waitlist with a fancier name. Ours works differently, mostly because our production actually works differently.

When a piece is marked pre-order, it means the run hasn't been cut yet. We don't hold fabric or book atelier hours speculatively — a run size is set by how many people actually want the piece, not by a forecast someone made months ago. So reserving a pre-order piece takes no payment at all. You choose your size, you're on the list, and that's the entire commitment on your side.

Once there's enough interest to justify opening the run, we go into production. Depending on the technique — precision cutwork takes longer than a plain linen cut — this is usually a matter of weeks, not months, though we'd rather tell you honestly if a piece is running behind than promise a date we can't hold.

The one thing you get for reserving early: a discount code for when the piece actually ships, as a small thank-you for committing before the run existed. It's applied at checkout once you're notified.

If the run doesn't fill — which happens rarely, but does happen — you're simply never charged, and we'll usually let you know either way rather than leaving you wondering.

We know "made once ordered" asks more patience than a piece already sitting in a warehouse. In exchange, nothing you buy this way was made speculatively, sized wrong for the market, or discounted into landfill six months later because someone guessed demand incorrectly. That trade feels like the right one to us.`,
  },
];

async function main() {
  let removed = 0;
  for (const slug of RETIRE_SLUGS) {
    const res = await prisma.blogPost.deleteMany({ where: { slug } });
    if (res.count > 0) { console.log(`  - removed retired post: ${slug}`); removed++; }
  }

  // Not a plain "skip if it exists" anymore: a post whose slug survived from an
  // older run can carry stale body text (e.g. an earlier draft that still
  // mentioned retired-catalogue techniques like bandhani/mirror-work) that a
  // pure skip would leave live forever. So existing posts are diffed against
  // the POSTS content below and updated in place when they've drifted.
  let created = 0, updated = 0, unchanged = 0;
  for (const post of POSTS) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });

    const product = post.productSlug
      ? await prisma.product.findUnique({ where: { slug: post.productSlug }, include: { images: { orderBy: { position: "asc" }, take: 1 } } })
      : null;
    if (post.productSlug && !product) { console.warn(`  ! product "${post.productSlug}" not found — creating/updating post without a cover image or tag`); }
    const coverImage = product?.images[0]?.url ?? null;

    if (existing) {
      const stale =
        existing.title !== post.title ||
        existing.subtitle !== post.subtitle ||
        existing.body !== post.body ||
        (post.productSlug != null && existing.coverImage !== coverImage);
      if (!stale) { console.log(`  = ${post.slug} already up to date, skipping`); unchanged++; continue; }

      await prisma.blogPost.update({
        where: { slug: post.slug },
        data: { title: post.title, subtitle: post.subtitle, body: post.body, coverImage },
      });
      console.log(`  ~ ${post.slug} was stale — updated to current content`);
      updated++;
      continue;
    }

    await prisma.blogPost.create({
      data: {
        slug: post.slug, title: post.title, subtitle: post.subtitle, body: post.body,
        coverImage,
        status: "PUBLISHED", publishedAt: new Date(), authorName: "A & I Editorial",
        products: product ? { create: [{ productId: product.id, position: 0 }] } : undefined,
      },
    });
    console.log(`  + ${post.slug} (tagged: ${product?.name ?? "none"})`);
    created++;
  }
  console.log(`Done. Removed ${removed} retired post(s), created ${created}, updated ${updated} stale post(s), left ${unchanged} unchanged.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
