import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import Script from "next/script";

// This layout now reads SiteSettings from the database for metadata/GA4/
// favicon — which means it can never be safely prerendered at build time
// (same reasoning as the storefront/admin/vendor layouts). Without this,
// Next tries to run the DB call while generating the special /_not-found
// page at build time, which is exactly what broke here.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const s = await getSiteSettings();
  return {
    title: { default: s.siteName, template: `%s — A&I` },
    description: s.description || "Indian craft, global silhouette. Womenswear handmade in small runs across India.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    icons: { icon: s.faviconUrl || "/icon.png", apple: s.faviconUrl || "/apple-icon.png" },
    manifest: "/manifest.json",
    verification: {
      google: s.googleSiteVerification || undefined,
      other: s.bingSiteVerification ? { "msvalidate.01": s.bingSiteVerification } : undefined,
    },
    openGraph: {
      title: s.siteName, description: s.tagline || "Indian craft, global silhouette.",
      siteName: s.siteName, type: "website",
      images: [{ url: s.ogImageUrl || "/og-default.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" as const },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings();
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
        {s.gaMeasurementId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${s.gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${s.gaMeasurementId}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
