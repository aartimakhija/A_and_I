import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "#0D0C0B", color: "#F0EBE3", textAlign: "center", padding: 24,
    }}>
      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(70px,14vw,160px)", lineHeight: 1, color: "#C4A96A", fontStyle: "italic" }}>404</span>
      <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: "clamp(26px,4vw,40px)", margin: "10px 0 14px" }}>
        This page wandered off the runway.
      </h1>
      <p style={{ fontFamily: "system-ui, sans-serif", fontWeight: 300, fontSize: 14, color: "rgba(240,235,227,0.6)", maxWidth: 380, lineHeight: 1.7 }}>
        The piece you're looking for isn't here — but the rest of the collection is.
      </p>
      <Link href="/" style={{
        marginTop: 30, fontFamily: "system-ui, sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
        color: "#0D0C0B", background: "#F0EBE3", padding: "14px 34px", textDecoration: "none",
      }}>
        Return home
      </Link>
    </main>
  );
}
