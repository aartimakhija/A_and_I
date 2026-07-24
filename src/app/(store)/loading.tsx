export default function StoreLoading() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @keyframes aandi-pulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.75; } }
        .aandi-loading-mark { animation: aandi-pulse 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .aandi-loading-mark { animation: none; opacity: 0.6; } }
      `}</style>
      <div className="aandi-loading-mark" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, letterSpacing: 2, color: "#8A7A6A" }}>
        A <span style={{ color: "#C4A96A", fontStyle: "italic" }}>&amp;</span> I
      </div>
    </div>
  );
}
