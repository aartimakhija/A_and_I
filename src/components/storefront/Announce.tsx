"use client";
import { T, SANS } from "./theme";
import { Countdown } from "./primitives";
import { useStore } from "./StoreContext";

export function Announce() {
  const { siteSettings } = useStore();
  // A frozen "00D 00H 00M 00S" reads as broken software, not urgency — so
  // the countdown only renders at all when there's a real, future target
  // date set in Admin → Settings. No date set (or one that's passed) means
  // no countdown, not a stuck clock.
  const dropAt = siteSettings.nextDropAt ? new Date(siteSettings.nextDropAt).getTime() : null;
  const showCountdown = dropAt !== null && dropAt > Date.now();

  return (
    <div style={{ background: T.olive, color: T.linenLt, textAlign: "center", padding: "8px 14px",
      fontFamily: SANS, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
      <span style={{ opacity: 0.85 }}>{siteSettings.announcementText || "Made in India, in small runs"}</span>
      {showCountdown && (
        <>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ opacity: 0.9 }}><Countdown target={dropAt!} /></span>
        </>
      )}
      <span style={{ opacity: 0.4 }}>·</span>
      <span style={{ opacity: 0.85 }}>India / ₹ INR</span>
    </div>
  );
}
