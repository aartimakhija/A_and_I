"use client";
import Link from "next/link";
import { T, SANS, SERIF } from "./theme";

export function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Shop", [["Collection", "/shop/all"], ["Lookbook", "/lookbook"], ["About", "/about"]]],
    ["Help", [["Shipping & Returns", "/account/orders"], ["Size guide", "/about"], ["Contact", "/contact"]]],
    ["Connect", [["Instagram", "https://instagram.com"], ["WhatsApp", "https://wa.me/"], ["Pinterest", "https://pinterest.com"]]],
  ];
  return (
    <footer style={{ background: T.dark, padding: "clamp(48px,7vw,72px) clamp(20px,4vw,48px) 36px", marginTop: "auto" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 44 }} className="grid-foot">
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 30, color: T.linenLt }}>A <span style={{ color: T.gold, fontStyle: "italic" }}>&amp;</span> I</div>
            <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 13, lineHeight: 1.7, color: "rgba(196,184,168,0.55)", maxWidth: 280, marginTop: 12 }}>
              Womenswear where Indian craft meets a global silhouette. Made in small runs, by named hands.
            </p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: T.gold, marginBottom: 14 }}>{h}</div>
              {links.map(([label, href]) => (
                <Link key={label} href={href} className="ulink" style={{ display: "block", marginBottom: 9, textDecoration: "none",
                  fontFamily: SANS, fontWeight: 300, fontSize: 12, color: "rgba(196,184,168,0.6)", transition: "color 0.2s" }}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${T.darkBorder}`, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: "rgba(196,184,168,0.35)" }}>© {new Date().getFullYear()} A & I — Style With Us</span>
          <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: "rgba(196,184,168,0.35)" }}>Made in India</span>
        </div>
      </div>
    </footer>
  );
}
