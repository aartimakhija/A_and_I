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
import type { SFProduct } from "@/lib/storefront-adapter";
import type { SiteSettingsSlice } from "./StoreContext";

// Activates the .reveal / .reveal-img fade-in system defined in GlobalStyle.
// Those classes start at opacity:0 and only become visible once JS marks them
// with data-in — without this, every product grid, photo, and section using
// them (Home, Collection, Product, Lookbook, About, SocialProof) stays
// invisible forever, which is exactly the "empty" storefront that was showing.
//
// This used to re-query on every pathname change and bail out for good if it
// found zero .reveal elements at that exact instant (`if (!els.length)
// return`). On a client-side navigation, this effect (living in the shared
// layout's StoreShell) can fire before the new page's Server Component
// content has actually landed in the DOM — a real, confirmed race, not a
// hypothetical one. When it lost that race, it found nothing, bailed out,
// and never got another chance, since the effect only re-runs on the next
// pathname change — so the whole page stayed permanently invisible.
//
// Fixed with a single persistent IntersectionObserver for the page's entire
// lifetime, plus a MutationObserver that (re)scans for any new, not-yet-
// tagged .reveal elements whenever the DOM changes — covering the initial
// load, streamed-in content, and every future navigation, with no reliance
// on timing.
function useRevealObserver() {
  useEffect(() => {
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

    const observeNew = () => {
      document.querySelectorAll(".reveal:not([data-in]), .reveal-img:not([data-in])").forEach((el) => io.observe(el));
    };

    observeNew();
    const mo = new MutationObserver(observeNew);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
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

export function StoreShell({ catalogue, categories, isLoggedIn, initialSaved, siteSettings, children }: {
  catalogue: SFProduct[]; categories: { slug: string; name: string }[]; isLoggedIn: boolean; initialSaved: string[]; siteSettings: SiteSettingsSlice; children: ReactNode;
}) {
  const rm = usePrefersReducedMotion();
  useParallax(rm);
  useRevealObserver();
  useCaptureReferral();

  return (
    <StoreProviders catalogue={catalogue} categories={categories} rm={rm} isLoggedIn={isLoggedIn} initialSaved={initialSaved} siteSettings={siteSettings}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <GlobalStyle />
        <div className="fx-grain" />
        <div className="fx-vignette" />
        <Announce />
        <Nav />
        <main className="flex-1">{children}</main>
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
