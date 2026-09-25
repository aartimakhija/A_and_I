"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { layer } from "./hooks";
import { useStore } from "./StoreContext";
import { formatPrice } from "@/lib/format";
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
    intent: "Heritage-inspired geometry, modern attitude. Let the cutwork lead and keep everything else earthy.",
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
  <div className="grid grid-cols-[100px_1fr] gap-4 border-t border-border py-4">
    <span className="eyebrow pt-0.5">{label}</span>
    <span className="text-sm font-light leading-relaxed text-muted-foreground">{children}</span>
  </div>
);

export function Lookbook({ products }: { products: SFProduct[] }) {
  const router = useRouter();
  const { rm } = useStore();
  const looks = LOOKS.slice(0, products.length).map((look, i) => ({ ...look, product: products[i] }));

  return (
    <>
      <header className="shell pb-6 pt-16 text-center md:pb-9 md:pt-20">
        <span className="eyebrow">SS&apos;26 · The Styling Edit</span>
        <h1 className="display-lg mt-2">The <span className="gold-italic">Lookbook</span></h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] font-light leading-relaxed text-muted-foreground">
          Styled head to toe — the bag, the jewellery, the shoes. Everything you need to wear them out the door.
        </p>
      </header>

      {looks.map((look, i) => {
        const d = look.product;
        const flip = i % 2 === 1;
        return (
          <section key={d.id} className={i % 2 === 0 ? "bg-background" : "bg-secondary"}>
            <div className="shell grid items-center gap-8 py-10 md:grid-cols-2 md:gap-16 md:py-20">
              <button
                className={`relative aspect-4/5 overflow-hidden bg-card ${flip ? "md:order-2" : "md:order-1"}`}
                onClick={() => router.push(`/products/${d.slug}`)}
                style={layer(2.6, rm)}
              >
                {d.images[0] && <Image src={d.images[0]} alt={d.name} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-contain" />}
              </button>
              <div className={flip ? "md:order-1" : "md:order-2"}>
                <div className="font-display text-5xl leading-none text-primary/50 md:text-6xl">{String(i + 1).padStart(2, "0")}</div>
                <div className="mt-2.5"><span className="eyebrow">{look.occasion}</span></div>
                <h2 className="display-md my-3.5">{d.name}</h2>
                <p className="max-w-md text-[15px] font-light leading-loose text-muted-foreground">{look.intent}</p>
                <div className="mt-5.5">
                  <Row label="The bag">{look.bag}</Row>
                  <Row label="The jewellery">{look.jewels}</Row>
                  <Row label="On your feet">{look.feet}</Row>
                </div>
                <div className="mt-7">
                  <button onClick={() => router.push(`/products/${d.slug}`)} className="btn-outline-ink">
                    Shop this look — {formatPrice(d.price)}
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      {looks.length === 0 && (
        <p className="px-6 py-10 text-center text-muted-foreground">Add products to the catalogue to populate the lookbook.</p>
      )}
    </>
  );
}
