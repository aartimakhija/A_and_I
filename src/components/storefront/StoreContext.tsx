"use client";
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import type { SFProduct } from "@/lib/storefront-adapter";

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

export function StoreProviders({ catalogue, rm, children }: { catalogue: SFProduct[]; rm: boolean; children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (real persistence across visits — this is
  // a deployed site, not a sandboxed artifact, so browser storage is appropriate here).
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY); if (c) setCart(JSON.parse(c));
      const s = localStorage.getItem(SAVED_KEY); if (s) setSaved(JSON.parse(s));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); }, [saved, hydrated]);

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
  const toggleSaved = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <StoreCtx.Provider value={{
      catalogue, cart, addToCart, removeFromCart, clearCart, subtotal, cartOpen, setCartOpen,
      saved, toggleSaved, savedOpen, setSavedOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen, rm,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}
