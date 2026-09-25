"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "./StoreContext";

const links: [string, string][] = [
  ["/", "Home"], ["/lookbook", "Lookbook"], ["/blog", "Journal"], ["/bespoke", "Bespoke"], ["/about", "About"], ["/contact", "Contact"],
];
// Desktop reaches these from the footer's "Studio" column instead of a nav
// dropdown; the mobile drawer lists them directly after the primary links.
const mobileExtra: [string, string][] = [
  ["/craft", "Craft"], ["/founder", "Founder"], ["/visit", "Visit"],
];

export function Nav() {
  const pathname = usePathname();
  const { cart, setCartOpen, saved, setSavedOpen, setSearchOpen, menuOpen, setMenuOpen, isLoggedIn } = useStore();

  const navLinkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname?.startsWith(href.split("/").slice(0, 2).join("/"));
    return `link-underline micro ${active ? "font-normal text-foreground" : "font-light text-muted-foreground"}`;
  };

  return (
    <nav className="sticky top-0 z-50 flex h-[62px] items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur-md md:px-12">
      <Link href="/" className="flex items-baseline gap-2 font-display text-2xl tracking-wide text-foreground">
        A&nbsp;<span className="gold-italic">&amp;</span>&nbsp;I
        <span className="ml-1 text-[8px] uppercase tracking-[0.3em] text-muted-foreground">Style with us</span>
      </Link>

      <div className="hidden items-center gap-8 md:flex">
        <Link href="/" className={navLinkClass("/")}>Home</Link>
        <Link href="/shop/all" className={navLinkClass("/shop")}>Collection</Link>
        {links.slice(1).map(([href, label]) => (
          <Link key={href} href={href} className={navLinkClass(href)}>{label}</Link>
        ))}
      </div>

      <div className="flex items-center gap-4.5">
        <button onClick={() => setSearchOpen(true)} className="micro hidden text-muted-foreground md:inline">Search</button>
        <button onClick={() => setSavedOpen(true)} className="micro hidden text-muted-foreground md:inline">
          Saved{saved.length > 0 ? ` (${saved.length})` : ""}
        </button>
        <Link href={isLoggedIn ? "/account/orders" : "/login"} className="link-underline micro hidden text-muted-foreground md:inline">
          {isLoggedIn ? "Account" : "Login"}
        </Link>
        <button onClick={() => setCartOpen(true)} className="micro relative text-foreground">
          Bag
          {cart.length > 0 && <span className="ml-1.5 text-[10px] text-primary">({cart.length})</span>}
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" className="micro text-foreground md:hidden">
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-[62px] flex flex-col gap-4 border-b border-border bg-background px-6 py-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className={`${navLinkClass("/")} text-left text-sm`}>Home</Link>
          <Link href="/shop/all" onClick={() => setMenuOpen(false)} className={`${navLinkClass("/shop/all")} text-left text-sm`}>Collection</Link>
          {links.slice(1).map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`${navLinkClass(href)} text-left text-sm`}>{label}</Link>
          ))}
          {mobileExtra.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`${navLinkClass(href)} text-left text-sm`}>{label}</Link>
          ))}
          <button onClick={() => { setMenuOpen(false); setSearchOpen(true); }} className="micro text-left text-sm text-muted-foreground">Search</button>
          <button onClick={() => { setMenuOpen(false); setSavedOpen(true); }} className="micro text-left text-sm text-muted-foreground">
            Saved{saved.length > 0 ? ` (${saved.length})` : ""}
          </button>
          <Link href={isLoggedIn ? "/account/orders" : "/login"} onClick={() => setMenuOpen(false)} className={`${navLinkClass(isLoggedIn ? "/account" : "/login")} text-left text-sm`}>
            {isLoggedIn ? "Account" : "Login"}
          </Link>
        </div>
      )}
    </nav>
  );
}
