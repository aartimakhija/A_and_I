"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, SANS, SERIF } from "./theme";
import { useStore } from "./StoreContext";

const links: [string, string][] = [
  ["/", "Home"], ["/shop/all", "Collection"], ["/lookbook", "Lookbook"], ["/about", "About"], ["/contact", "Contact"],
];

export function Nav() {
  const pathname = usePathname();
  const { cart, setCartOpen, saved, setSavedOpen, setSearchOpen, menuOpen, setMenuOpen } = useStore();

  const linkStyle = (href: string): React.CSSProperties => {
    const active = href === "/" ? pathname === "/" : pathname?.startsWith(href.split("/").slice(0, 2).join("/"));
    return {
      fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
      fontWeight: active ? 400 : 300, color: active ? T.ink : T.stone,
      background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.25s",
    };
  };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(248,246,243,0.86)",
      backdropFilter: "blur(14px)", borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(20px,4vw,48px)", height: 62 }}>
      <Link href="/" style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "none",
        fontFamily: SERIF, fontSize: 24, letterSpacing: 1, color: T.ink, display: "flex", alignItems: "baseline", gap: 8 }}>
        A&nbsp;<span style={{ color: T.gold, fontStyle: "italic" }}>&amp;</span>&nbsp;I
        <span style={{ fontFamily: SANS, fontSize: 8, letterSpacing: 3, color: T.stone, textTransform: "uppercase", marginLeft: 4 }}>Style with us</span>
      </Link>

      <div className="nav-links" style={{ display: "flex", gap: 34, alignItems: "center" }}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="ulink" style={linkStyle(href)}>{label}</Link>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button onClick={() => setSearchOpen(true)} className="util-hide" style={{ background: "none", border: "none", cursor: "pointer",
          fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>Search</button>
        <button onClick={() => setSavedOpen(true)} className="util-hide" style={{ background: "none", border: "none", cursor: "pointer",
          fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>
          Saved{saved.length > 0 ? ` (${saved.length})` : ""}
        </button>
        <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer",
          fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.ink, position: "relative" }}>
          Bag
          {cart.length > 0 && <span style={{ marginLeft: 6, fontSize: 10, color: T.gold }}>({cart.length})</span>}
        </button>
        <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
          style={{ display: "none", background: "none", border: "none", cursor: "pointer",
            fontFamily: SANS, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.ink }}>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div className="nav-mobile" style={{ position: "absolute", top: 62, left: 0, right: 0,
          background: T.bg, borderBottom: `1px solid ${T.border}`, padding: "16px 24px",
          display: "flex", flexDirection: "column", gap: 16 }}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ ...linkStyle(href), textAlign: "left", fontSize: 14 }}>{label}</Link>
          ))}
          <button onClick={() => { setMenuOpen(false); setSearchOpen(true); }} style={{ ...linkStyle(""), textAlign: "left", fontSize: 14 }}>Search</button>
          <button onClick={() => { setMenuOpen(false); setSavedOpen(true); }} style={{ ...linkStyle(""), textAlign: "left", fontSize: 14 }}>
            Saved{saved.length > 0 ? ` (${saved.length})` : ""}
          </button>
        </div>
      )}
    </nav>
  );
}
