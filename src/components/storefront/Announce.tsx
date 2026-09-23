"use client";
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
    <div className="micro flex flex-wrap items-center justify-center gap-6 bg-paper px-3.5 py-2 text-center text-paper-foreground">
      <span className="opacity-85">{siteSettings.announcementText || "Made in India, in small runs"}</span>
      {showCountdown && (
        <>
          <span className="opacity-40">·</span>
          <span className="opacity-90"><Countdown target={dropAt!} /></span>
        </>
      )}
      <span className="opacity-40">·</span>
      <span className="opacity-85">India / ₹ INR</span>
    </div>
  );
}
