import { pageMetadata, jsonLdHtml } from "@/lib/seo";
import { FaqClient } from "./FaqClient";
import { faqs } from "./data";

export const metadata = pageMetadata({
  title: "FAQ — Sizing, Shipping, Fabrics & Returns",
  description: "Answers on A&I sizing, checkout, made-to-order and pre-order timelines, fabric tiers, shipping, returns, studio visits and wholesale.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <FaqClient faqs={faqs} />
    </>
  );
}
