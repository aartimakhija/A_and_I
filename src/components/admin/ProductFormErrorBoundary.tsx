"use client";
// Wraps ProductForm specifically. Why this exists: the admin edit page's
// data-fetch is already wrapped in a try/catch (see edit/page.tsx) that
// prints the real Prisma/session error when the FETCH fails — but that
// catch can't see an error thrown while ProductForm itself renders,
// because a Server Component's own try/catch only covers code it runs
// synchronously; React invokes a Client Component's render function later,
// outside that scope. Any such crash used to surface as Next's generic
// "the specific message is omitted in production builds" box (real message
// gone, replaced with just a digest) because THAT redaction only applies to
// errors serialized across the Server→Client (RSC/flight) boundary — it
// never touches a plain React error boundary catching its own client
// subtree, so this one gets the real, unredacted error.name/message/stack.
import { Component, type ReactNode } from "react";

type State = { error: (Error & { digest?: string }) | null };

export class ProductFormErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Also lands in Vercel's Runtime Logs (server) / browser console (client).
    console.error("ProductForm crashed while rendering:", error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div style={{ padding: 24, maxWidth: 900, fontFamily: "system-ui, sans-serif" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>The product form crashed while rendering</h2>
        <div
          style={{
            background: "#fdecea",
            color: "#8a2f22",
            padding: 16,
            borderRadius: 4,
            fontSize: 13,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            marginBottom: 12,
          }}
        >
          <strong>{error.name || "Error"}:</strong> {error.message || "(no message)"}
        </div>
        {error.digest && <p style={{ fontSize: 11, color: "#aaa", marginBottom: 12 }}>Digest: {error.digest}</p>}
        {error.stack && (
          <pre style={{ fontSize: 11, background: "#f5f3ef", padding: 12, borderRadius: 4, overflowX: "auto" }}>
            {error.stack}
          </pre>
        )}
      </div>
    );
  }
}
