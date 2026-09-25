import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Size & Fit — Five Sizes, Made To Measure On Request",
  description: "How A&I sizing works: five sizes from XS to XL, how to measure yourself, and a made-to-measure route if none of them are quite you.",
  path: "/size-fit",
});

// Mirrors the chart shown on every product page (SizeChartButton.tsx) so the
// two never drift apart — standard extended alpha sizing, bust/waist/hips in inches.
const chart = [
  { size: "XS", usSize: "0–2", bust: "31–32\"", waist: "24–25\"", hips: "33–35\"" },
  { size: "S", usSize: "4–6", bust: "33–35\"", waist: "26–27\"", hips: "36–37\"" },
  { size: "M", usSize: "8–10", bust: "36–37\"", waist: "28–29\"", hips: "38–39\"" },
  { size: "L", usSize: "12–14", bust: "38–40\"", waist: "30–32\"", hips: "41–42\"" },
  { size: "XL", usSize: "16–18", bust: "41–43\"", waist: "33–35\"", hips: "43–45\"" },
];

const measures = [
  { k: "Bust", v: "Around the fullest part, tape flat under the arms. Wear the bra you would wear with the piece." },
  { k: "Waist", v: "The narrowest part of your torso, usually an inch above the navel. Breathe out normally." },
  { k: "Hip", v: "Around the widest point, roughly eight inches below the waist, feet together." },
];

const fitNotes = [
  { k: "Structured pieces", v: "Cut closer through the body. Between sizes on anything structured? Size up — our craft partner can take it in." },
  { k: "Draped & linen pieces", v: "Run generous by design, so the linen falls the way it's meant to instead of clinging. Stay true to size rather than sizing down." },
  { k: "Sets", v: "Both halves are cut in the same size. If your top and bottom differ, tell us in your order notes and we'll split it at no extra cost." },
];

export default function SizeFitPage() {
  return (
    <>
      <section className="shell pb-14 pt-20">
        <p className="eyebrow">Size &amp; fit</p>
        <h1 className="display-xl mt-6">
          Five sizes, and a <span className="gold-italic">tape measure.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          Every piece runs XS to XL. Take the fit quiz for a quick recommendation, or use the chart
          and the measuring notes below to choose for yourself.
        </p>
      </section>

      <section className="shell pb-20">
        <h2 className="display-md">The size chart</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                {["Size", "US size", "Bust", "Waist", "Hips"].map((h) => (
                  <th key={h} className="eyebrow-muted border-b border-foreground px-2.5 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.map((r) => (
                <tr key={r.size}>
                  <td className="border-b border-border px-2.5 py-2.5 font-display text-base text-foreground">{r.size}</td>
                  <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.usSize}</td>
                  <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.bust}</td>
                  <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.waist}</td>
                  <td className="border-b border-border px-2.5 py-2.5 text-sm text-muted-foreground">{r.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Between sizes, or want a piece cut to your own measurements? Bespoke is made to measure —
          no surcharge on the fabric tier you have chosen.
        </p>
        <Link href="/fit-quiz" className="btn-outline-ink mt-6 inline-flex">
          Take the fit quiz instead
        </Link>
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell py-24">
          <p className="micro text-paper-muted">How to measure</p>
          <h2 className="display-lg mt-6">
            Three numbers, <span className="italic text-accent">three minutes.</span>
          </h2>
          <p className="mt-6 max-w-xl text-paper-muted">
            A soft tape, a mirror and someone to hold the end if you have one. Keep the tape level
            and snug, never tight.
          </p>
          <dl className="mt-10 grid gap-8 sm:grid-cols-3">
            {measures.map((m) => (
              <div key={m.k}>
                <dt className="display-md text-xl italic">{m.k}</dt>
                <dd className="mt-3 text-sm text-paper-muted">{m.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="shell py-20">
        <h2 className="display-lg">How each shape is meant to sit.</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {fitNotes.map((f) => (
            <div key={f.k} className="border-t border-border pt-6">
              <h3 className="display-md text-xl italic">{f.k}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{f.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="shell flex flex-wrap items-end justify-between gap-8 py-20">
          <div>
            <h2 className="display-md">Still unsure?</h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Send your measurements and the piece you want. We reply within two working days with a
              recommendation, and we will say if it is the wrong shape for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/contact" className="btn-solid-gold">
              Ask the studio
            </Link>
            <Link href="/bespoke" className="btn-outline-ink">
              Made to measure
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
