"use client";
import { useEffect } from "react";

// Admin-only error boundary — every route under here is already gated by
// middleware to ADMIN/VENDOR sessions, so unlike the customer-facing
// src/app/error.tsx (which has to guess with a friendly generic message),
// this one is safe to show the real error message and digest. That's the
// difference between "something didn't load right, try again" and actually
// knowing what broke the next time an admin page 500s.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 32, maxWidth: 720, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>This admin page hit an error</h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
        Shown in full because you're signed in as staff — customers see a generic message instead.
      </p>
      <div style={{ background: "#fdecea", color: "#8a2f22", padding: 16, borderRadius: 4, fontSize: 13, marginBottom: 16, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        <strong>{error.name || "Error"}:</strong> {error.message || "(no message)"}
      </div>
      {error.stack && (
        <details style={{ marginBottom: 20 }}>
          <summary style={{ cursor: "pointer", fontSize: 12, color: "#888" }}>Stack trace</summary>
          <pre style={{ fontSize: 11, background: "#f5f3ef", padding: 12, borderRadius: 4, overflowX: "auto", marginTop: 8 }}>{error.stack}</pre>
        </details>
      )}
      {error.digest && <p style={{ fontSize: 11, color: "#aaa", marginBottom: 20 }}>Digest: {error.digest}</p>}
      <button onClick={() => reset()} style={{ padding: "10px 22px", background: "#1C1A18", color: "#fff", border: 0, cursor: "pointer", fontSize: 13 }}>
        Try again
      </button>
    </div>
  );
}
