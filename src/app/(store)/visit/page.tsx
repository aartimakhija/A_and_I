import { pageMetadata } from "@/lib/seo";
import { VisitForm } from "./VisitForm";

export const metadata = pageMetadata({
  title: "Visit The Studio",
  description: "Book a private hour at the A&I studio in Ahmedabad, try the fabrics and get measured, with no obligation on the day.",
  path: "/visit",
});

const appointments = [
  { t: "The studio hour", where: "Ahmedabad, by appointment", d: "One hour, one rail, the current run in every fabric tier. You are measured properly and we cut nothing until you have slept on it." },
  { t: "A call instead", where: "Anywhere, 20 minutes", d: "Video, swatch photos held up in daylight, and honest talk about which size to take. Most people who do this order once and never send it back." },
  { t: "Swatches by post", where: "Anywhere in India", d: "Can't come, can't call? Name the pieces you are weighing up and we post the cloths so you can see them against your own skin and light." },
];

const hour = [
  { n: "01", t: "Before you arrive", d: "Send the pieces you want on the rail. They are pressed and hung before you walk in, so the hour is spent on you and not on hunting." },
  { n: "02", t: "The cloth first", d: "You handle every fabric tier of the same design in daylight. Handloom is impossible to judge on a screen — this is the part that changes minds." },
  { n: "03", t: "Measured properly", d: "Bust, waist and hip, taken once and kept on your file so every future piece is cut to the same body." },
  { n: "04", t: "Nothing signed", d: "You leave with notes and no obligation. If you decide later, the enquiry picks up exactly where the hour ended." },
];

export default function VisitPage() {
  return (
    <>
      <section className="shell py-20">
        <p className="eyebrow">Our world</p>
        <h1 className="display-xl mt-6">
          Come and <span className="gold-italic">feel the cloth.</span>
        </h1>
        <p className="mt-7 max-w-xl text-muted-foreground">
          Handloom is difficult to photograph and impossible to fake in person. If you can reach us,
          come — nothing is expected of you on the day.
        </p>
      </section>

      <section className="shell grid gap-10 pb-24 md:grid-cols-3">
        {appointments.map((a) => (
          <div key={a.t} className="h-full border border-border bg-card p-8">
            <p className="eyebrow">{a.where}</p>
            <h2 className="display-md mt-4 text-xl">{a.t}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{a.d}</p>
          </div>
        ))}
      </section>

      <section className="shell border-t border-border py-20">
        <p className="eyebrow">How the hour runs</p>
        <h2 className="display-lg mt-6 max-w-2xl">
          Sixty minutes, <span className="gold-italic">no theatre.</span>
        </h2>
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {hour.map((h) => (
            <li key={h.n} className="border-t border-border pt-6">
              <p className="micro text-primary">{h.n}</p>
              <h3 className="display-md mt-3 text-lg">{h.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{h.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid max-w-3xl gap-6 border border-border bg-card p-8 sm:grid-cols-3">
          <div>
            <p className="micro text-primary">Where</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The studio in Ahmedabad, Gujarat. The full address is sent with your confirmation — it
              is a working studio, not a shop floor.
            </p>
          </div>
          <div>
            <p className="micro text-primary">When</p>
            <p className="mt-2 text-sm text-muted-foreground">
              By appointment only, on the days the studio is not cutting. We offer you the next
              available slots when you write.
            </p>
          </div>
          <div>
            <p className="micro text-primary">Who</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You are seen by Artee, who designs the pieces. Bring one person if you like a second
              opinion.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper text-paper-foreground">
        <div className="shell grid items-center gap-14 py-24 lg:grid-cols-2">
          <div className="aspect-4/5 w-full bg-paper-foreground/10" aria-hidden="true" />
          <div>
            <h2 className="display-lg">
              Ask for <span className="italic text-accent">an hour.</span>
            </h2>
            <p className="mt-6 text-paper-muted">
              Tell us the city you are in and roughly when. We reply with the next dates we can
              offer, in person or by call.
            </p>
            <VisitForm />
          </div>
        </div>
      </section>
    </>
  );
}
