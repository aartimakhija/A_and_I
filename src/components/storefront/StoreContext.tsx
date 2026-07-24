"use client";
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import type { SFProduct } from "@/lib/storefront-adapter";
import type { FitAnswers, Size } from "@/lib/fit";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  color: string;
  images: string[];
  size: string;
  tier?: string;
  price: number; // rupees, base + tier add
  qty: number;
};

export type StyleProfile = { answers: FitAnswers; recommendedSize: Size; note: string };

type StoreState = {
  catalogue: SFProduct[]; // all ACTIVE products — powers search + wishlist drawer lookups
  cart: CartItem[];
  addToCart: (p: SFProduct, size: string, tier?: string) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  subtotal: number;
  cartOpen: boolean; setCartOpen: (v: boolean) => void;
  saved: string[]; // product ids
  toggleSaved: (id: string) => void;
  savedOpen: boolean; setSavedOpen: (v: boolean) => void;
  searchOpen: boolean; setSearchOpen: (v: boolean) => void;
  menuOpen: boolean; setMenuOpen: (v: boolean) => void;
  stylistOpen: boolean; setStylistOpen: (v: boolean) => void;
  styleProfile: StyleProfile | null; setStyleProfile: (p: StyleProfile | null) => void;
  rm: boolean;
};

const StoreCtx = createContext<StoreState | null>(null);
export const useStore = () => {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within <StoreProviders>");
  return ctx;
};

const CART_KEY = "aandi:cart";
const SAVED_KEY = "aandi:saved";
const STYLE_KEY = "aandi:style-profile";

export function StoreProviders({ catalogue, rm, isLoggedIn, initialSaved, children }: {
  catalogue: SFProduct[]; rm: boolean; isLoggedIn: boolean; initialSaved: string[]; children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<string[]>(isLoggedIn ? initialSaved : []);
  const [styleProfile, setStyleProfileState] = useState<StyleProfile | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stylistOpen, setStylistOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (real persistence across visits — this is
  // a deployed site, not a sandboxed artifact, so browser storage is appropriate here).
  // Signed-in customers skip the local wishlist entirely — theirs already came
  // from the server (initialSaved) and every toggle writes straight to the account.
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY); if (c) setCart(JSON.parse(c));
      if (!isLoggedIn) { const s = localStorage.getItem(SAVED_KEY); if (s) setSaved(JSON.parse(s)); }
      const p = localStorage.getItem(STYLE_KEY); if (p) setStyleProfileState(JSON.parse(p));
    } catch {}
    setHydrated(true);
  }, [isLoggedIn]);
  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated && !isLoggedIn) localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); }, [saved, hydrated, isLoggedIn]);
  useEffect(() => {
    if (!hydrated) return;
    if (styleProfile) localStorage.setItem(STYLE_KEY, JSON.stringify(styleProfile));
    else localStorage.removeItem(STYLE_KEY);
  }, [styleProfile, hydrated]);

  const setStyleProfile = (p: StyleProfile | null) => setStyleProfileState(p);

  const addToCart = (p: SFProduct, size: string, tier?: string) => {
    const tierAdd = p.tiers.find((t) => t.label === tier)?.priceAdd ?? 0;
    setCart((c) => [...c, {
      key: `${Date.now()}-${Math.random()}`, productId: p.id, slug: p.slug, name: p.name,
      color: p.color, images: p.images, size, tier, price: p.price + tierAdd, qty: 1,
    }]);
    setCartOpen(true);
  };
  const removeFromCart = (key: string) => setCart((c) => c.filter((i) => i.key !== key));
  const clearCart = () => setCart([]);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const toggleSaved = (id: string) => {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    if (isLoggedIn) {
      fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: id }) })
        .catch(() => {}); // best-effort — local state already updated optimistically
    }
  };

  return (
    <StoreCtx.Provider value={{
      catalogue, cart, addToCart, removeFromCart, clearCart, subtotal, cartOpen, setCartOpen,
      saved, toggleSaved, savedOpen, setSavedOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen,
      stylistOpen, setStylistOpen, styleProfile, setStyleProfile, rm,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}
