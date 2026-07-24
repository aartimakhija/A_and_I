"use client";
import Link from "next/link";
import { T, SANS, SERIF } from "./theme";
import { useStore } from "./StoreContext";

export function Footer() {
  const { siteSettings } = useStore();
  const social: [string, string | null][] = [
    ["Instagram", siteSettings.socialInstagram], ["WhatsApp", siteSettings.socialWhatsapp],
    ["Pinterest", siteSettings.socialPinterest], ["Facebook", siteSettings.socialFacebook], ["X", siteSettings.socialTwitter],
  ].filter(([, url]) => !!url) as [string, string][];

  const cols: [string, [string, string][]][] = [
    ["Shop", [["Collection", "/shop/all"], ["Lookbook", "/lookbook"], ["Journal", "/blog"], ["About", "/about"]]],
    ["Help", [["Shipping & Returns", "/account/orders"], ["Find your fit", "/fit-quiz"], ["Refer a friend", "/account/refer"], ["Contact", "/contact"]]],
    ...(social.length > 0 ? [["Connect", social] as [string, [string, string][]]] : []),
  ];

  return (
    <footer style={{ background: T.dark, padding: "clamp(48px,7vw,72px) clamp(20px,4vw,48px) 36px", marginTop: "auto" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 44 }} className="grid-foot">
          <div>
            {siteSettings.logoUrl ? (
              <img src={siteSettings.logoUrl} alt="A&I" style={{ height: 30, objectFit: "contain" }} />
            ) : (
              <div style={{ fontFamily: SERIF, fontSize: 30, color: T.linenLt }}>A <span style={{ color: T.gold, fontStyle: "italic" }}>&amp;</span> I</div>
            )}
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, lineHeight: 1.7, color: "rgba(196,184,168,0.55)", maxWidth: 280, marginTop: 12 }}>
              Womenswear where Indian craft meets a global silhouette. Made in small runs, by named hands.
            </p>
            {siteSettings.contactEmail && (
              <a href={`mailto:${siteSettings.contactEmail}`} style={{ display: "block", marginTop: 14, fontFamily: SANS, fontSize: 12, color: "rgba(196,184,168,0.6)", textDecoration: "none" }}>
                {siteSettings.contactEmail}
              </a>
            )}
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: T.gold, marginBottom: 14 }}>{h}</div>
              {links.map(([label, href]) => (
                href.startsWith("http") ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="ulink" style={{ display: "block", marginBottom: 9, textDecoration: "none",
                    fontFamily: SANS, fontWeight: 300, fontSize: 12, color: "rgba(196,184,168,0.6)", transition: "color 0.2s" }}>{label}</a>
                ) : (
                  <Link key={label} href={href} className="ulink" style={{ display: "block", marginBottom: 9, textDecoration: "none",
                    fontFamily: SANS, fontWeight: 300, fontSize: 12, color: "rgba(196,184,168,0.6)", transition: "color 0.2s" }}>{label}</Link>
                )
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${T.darkBorder}`, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: "rgba(196,184,168,0.35)" }}>© {new Date().getFullYear()} A&I — Style With Us</span>
          <div style={{ display: "flex", gap: 18 }}>
            <Link href="/privacy" style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: "rgba(196,184,168,0.5)", textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: "rgba(196,184,168,0.5)", textDecoration: "none" }}>Terms of Service</Link>
          </div>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: "rgba(196,184,168,0.35)" }}>Made in India</span>
        </div>
      </div>
    </footer>
  );
}
