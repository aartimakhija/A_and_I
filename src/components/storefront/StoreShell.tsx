"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion, useParallax } from "./hooks";
import { StoreProviders } from "./StoreContext";
import { GlobalStyle } from "./GlobalStyle";
import { Announce } from "./Announce";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { SavedDrawer } from "./SavedDrawer";
import { ExitPopup } from "./ExitPopup";
import { StylistWidget } from "./StylistWidget";
import { T, SANS } from "./theme";
import type { SFProduct } from "@/lib/storefront-adapter";

// Activates the .reveal / .reveal-img fade-in system defined in GlobalStyle.
// Those classes start at opacity:0 and only become visible once JS marks them
// with data-in — without this, every product grid, photo, and section using
// them (Home, Collection, Product, Lookbook, About, SocialProof) stays
// invisible forever, which is exactly the "empty" storefront that was showing.
function useRevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-img");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "true");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // Re-scan every time the route changes, since navigating brings in a fresh
    // set of .reveal elements that this effect hasn't observed yet.
  }, [pathname]);
}

function useCaptureReferral() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref) localStorage.setItem("aandi:ref", ref.trim().toUpperCase());
    } catch {}
  }, [pathname]);
}

export function StoreShell({ catalogue, isLoggedIn, initialSaved, children }: {
  catalogue: SFProduct[]; isLoggedIn: boolean; initialSaved: string[]; children: ReactNode;
}) {
  const rm = usePrefersReducedMotion();
  useParallax(rm);
  useRevealObserver();
  useCaptureReferral();

  return (
    <StoreProviders catalogue={catalogue} rm={rm} isLoggedIn={isLoggedIn} initialSaved={initialSaved}>
      <div style={{ background: T.bg, minHeight: "100vh", color: T.ink, fontFamily: SANS, display: "flex", flexDirection: "column" }}>
        <GlobalStyle />
        <div className="fx-grain" />
        <div className="fx-vignette" />
        <Announce />
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <CartDrawer />
        <SavedDrawer />
        <SearchOverlay />
        <ExitPopup />
        <StylistWidget />
      </div>
    </StoreProviders>
  );
}
