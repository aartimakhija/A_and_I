"use client";
import { T, SANS, DROP_AT } from "./theme";
import { Countdown } from "./primitives";
import { useStore } from "./StoreContext";

export function Announce() {
  const { siteSettings } = useStore();
  return (
    <div style={{ background: T.olive, color: T.linenLt, textAlign: "center", padding: "8px 14px",
      fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
      <span style={{ opacity: 0.85 }}>{siteSettings.announcementText || "Made in India, in small runs"}</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ opacity: 0.9 }}><Countdown target={DROP_AT} /></span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ opacity: 0.85 }}>India / ₹ INR</span>
    </div>
  );
}
