"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Best-effort console trace for whoever's looking at browser devtools —
    // real server-side logging happens on Vercel's own logs regardless.
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F8F6F3", color: "#1C1A18" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 32, letterSpacing: 1, marginBottom: 12 }}>
              A<span style={{ color: "#C4A96A", fontStyle: "italic" }}>&amp;</span>I
            </div>
            <p style={{ fontSize: 16, color: "#33301f", marginBottom: 6 }}>Something didn't load right.</p>
            <p style={{ fontSize: 13, color: "#8A7A6A", marginBottom: 24, maxWidth: 380 }}>
              This is usually temporary — often a moment where the database was waking back up. Try again in a few seconds.
            </p>
            <button onClick={() => reset()} style={{ padding: "12px 28px", background: "#1C1A18", color: "#F8F6F3", border: 0, cursor: "pointer", fontSize: 13, letterSpacing: 1 }}>
              Try again
            </button>
            {error.digest && <p style={{ fontSize: 11, color: "#bbb", marginTop: 20 }}>Reference: {error.digest}</p>}
          </div>
        </div>
      </body>
    </html>
  );
}
