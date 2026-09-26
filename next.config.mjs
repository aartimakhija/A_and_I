/** @type {import('next').NextConfig} */

// Content-Security-Policy, shipped in Report-Only mode first: it reports
// violations to the browser console (and, if a report-uri were added, to a
// collector) without blocking anything, so it can't break checkout, GTM, or
// fonts. Every third-party origin the site actually loads is listed below —
// Razorpay's checkout script/iframe, Google Tag Manager + Analytics, and
// Google Fonts. Once a few days pass with a clean console across storefront,
// checkout, and admin, flip the header key below to plain
// "Content-Security-Policy" to start enforcing it.
//
// Checked the live report-only console across home, product, shop, craft,
// sustainability, gifting, founder, about and an empty-cart checkout page:
// GA4's actual beacon domain is analytics.google.com (not just
// www.google-analytics.com), and it also calls stats.g.doubleclick.net —
// neither was allowed, so connect-src below now includes both; enforcing
// the policy as it was would have silently cut off analytics. One
// remaining, expected violation: Google Ads' cross-domain "ga-audiences"
// remarketing pixel loads from whichever Google country domain matches the
// visitor's locale (seen here as google.co.in) — CSP can't wildcard across
// TLDs, so a fully clean console on that one line isn't achievable without
// a much looser img-src; it's a remarketing-signal nicety, not core
// analytics or checkout, so it's fine to enforce without chasing it further.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://checkout.razorpay.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.amazonaws.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.co.in",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://api.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://checkout.razorpay.com https://api.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
  async headers() {
    return [
      {
        // Applies to every route — baseline security headers (checklist item 8).
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS — safe to send even over the first HTTP request; browsers only
          // honor it once they've seen it over HTTPS, which Vercel terminates by default.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy-Report-Only", value: CSP },
        ],
      },
      {
        // Keep search engines out of the admin/vendor panels even if a link ever leaks.
        source: "/(admin|vendor)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};
export default nextConfig;
