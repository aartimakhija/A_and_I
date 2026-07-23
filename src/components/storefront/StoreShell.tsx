"use client";
import { ReactNode } from "react";
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
import { T, SANS } from "./theme";
import type { SFProduct } from "@/lib/storefront-adapter";

export function StoreShell({ catalogue, children }: { catalogue: SFProduct[]; children: ReactNode }) {
  const rm = usePrefersReducedMotion();
  useParallax(rm);

  return (
    <StoreProviders catalogue={catalogue} rm={rm}>
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
      </div>
    </StoreProviders>
  );
}
