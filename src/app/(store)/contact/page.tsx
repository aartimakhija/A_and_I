import { Contact } from "@/components/storefront/Contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with A&I — order questions, wholesale enquiries, press, and vendor partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  return <Contact />;
}
