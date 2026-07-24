"use client";
import { useRouter } from "next/navigation";
import { T, SANS, SERIF, peso } from "./theme";
import { Photo, Eyebrow, Title, Btn } from "./primitives";
import { layer } from "./hooks";
import { useStore } from "./StoreContext";
import type { SFProduct } from "@/lib/storefront-adapter";

const LOOKS = [
  { occasion: "Sangeet · Reception",
    intent: "Built for the entrance. Let the sequins carry the drama and keep everything else quiet and gold.",
    bag: "A structured gold minaudière, or a deep bottle-green velvet potli.",
    jewels: "Uncut polki studs and one stacked kada — skip the necklace, the neckline is the necklace.",
    feet: "Antique-gold block heels — comfort for a long night of being looked at." },
  { occasion: "Brunch · Cocktails",
    intent: "One co-ord, two moods. Dress it down for brunch, up for golden-hour cocktails.",
    bag: "A woven raffia tote by day; a slim gold box clutch after dark.",
    jewels: "Thin gold hoops and a fine chain by day — add a stacked cuff at night.",
    feet: "Tan strappy flats for daylight; nude heels to lengthen the palazzo for evening." },
  { occasion: "Mehndi · Festive day",
    intent: "Heritage print, modern attitude. Let the bandhani lead and keep everything else earthy.",
    bag: "A beaded potli in oxblood, or a tan leather sling for a fusion daytime look.",
    jewels: "Oxidised silver jhumkas and one statement ring — silver, not gold, against the orange.",
    feet: "Embroidered juttis for an Indian event; tan mules to take it Western." },
  { occasion: "Destination · Resort",
    intent: "A jumpsuit that travels. Keep the accessories playful and sun-ready.",
    bag: "A round straw basket bag, or a pink resin clutch for dinner.",
    jewels: "Oversized shell or resin earrings — let the silhouette do the rest.",
    feet: "Espadrille wedges, or white platform sneakers." },
  { occasion: "Date night · Cocktails",
    intent: "Soft but certain. Lean all the way into the palette with silver and pearl, nothing heavier.",
    bag: "A pearl-beaded micro bag, or a slim silver chain pouch.",
    jewels: "A single pearl drop and a fine tennis bracelet.",
    feet: "Strappy silver heels, or satin slingbacks." },
];

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 16, padding: "16px 0", borderTop: `1px solid ${T.border}` }} className="style-row">
    <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: T.gold, fontWeight: 400, paddingTop: 2 }}>{label}</span>
    <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.65, color: T.mid }}>{children}</span>
  </div>
);

export function Lookbook({ products }: { products: SFProduct[] }) {
  const router = useRouter();
  const { rm } = useStore();
  const looks = LOOKS.slice(0, products.length).map((look, i) => ({ ...look, product: products[i] }));

  return (
    <>
      <header style={{ textAlign: "center", padding: "clamp(48px,7vw,90px) 24px clamp(20px,3vw,36px)" }}>
        <Eyebrow>SS'26 · The Styling Edit</Eyebrow>
        <Title as="h1">The <span style={{ fontStyle: "italic", color: T.gold }}>Lookbook</span></Title>
        <p style={{ fontFamily: SANS, fontWeight: 300, color: T.mid, fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: "16px auto 0" }}>
          Styled head to toe — the bag, the jewellery, the shoes. Everything you need to wear them out the door.
        </p>
      </header>

      {looks.map((look, i) => {
        const d = look.product;
        const flip = i % 2 === 1;
        return (
          <section key={d.id} style={{ background: i % 2 === 0 ? "#fff" : T.linen }}>
            <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(40px,6vw,84px) clamp(20px,4vw,48px)",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,64px)", alignItems: "center" }} className="grid-2">
              <div className="look-img" style={{ order: flip ? 2 : 1, cursor: "pointer" }} onClick={() => router.push(`/products/${d.slug}`)}>
                <div style={layer(2.6, rm)}>
                  <Photo images={d.images} color={d.color} name={d.name} ratio="4/5" fit="contain" reveal eyebrow={`Look ${String(i + 1).padStart(2, "0")}`} />
                </div>
              </div>
              <div className="look-txt" style={{ order: flip ? 1 : 2 }}>
                <div style={{ fontFamily: SERIF, fontSize: "clamp(40px,5vw,68px)", color: T.gold, lineHeight: 1, opacity: 0.5 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ marginTop: 10 }}><Eyebrow>{look.occasion}</Eyebrow></div>
                <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: "clamp(28px,3.6vw,46px)", lineHeight: 1.04, color: T.ink, margin: "8px 0 14px" }}>{d.name}</h2>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: T.mid, maxWidth: 460 }}>{look.intent}</p>
                <div style={{ marginTop: 22 }}>
                  <Row label="The bag">{look.bag}</Row>
                  <Row label="The jewellery">{look.jewels}</Row>
                  <Row label="On your feet">{look.feet}</Row>
                </div>
                <div style={{ marginTop: 28 }}>
                  <Btn variant="ghost" onClick={() => router.push(`/products/${d.slug}`)}>Shop this look — {peso(d.price)}</Btn>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      {looks.length === 0 && (
        <p style={{ textAlign: "center", color: T.stone, padding: "40px 24px" }}>Add products to the catalogue to populate the lookbook.</p>
      )}
    </>
  );
}
