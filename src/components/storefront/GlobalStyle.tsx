"use client";
import { T } from "./theme";

export function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
      :root { --px:0; --py:0; }
      * { box-sizing: border-box; }
      body { margin: 0; }
      button:focus-visible, [role="button"]:focus-visible, input:focus-visible, a:focus-visible {
        outline: 2px solid ${T.gold}; outline-offset: 3px;
      }
      .marquee { animation: aandi-marquee 26s linear infinite; }
      @keyframes aandi-marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
      .kb { animation: aandi-kenburns 7.4s ease-out both; will-change: transform; }
      @keyframes aandi-kenburns { from { transform: scale(1.04) translate(0,0); } to { transform: scale(1.15) translate(-1.5%, -2.5%); } }
      .sheen::before { content: ""; position: absolute; top: 0; bottom: 0; width: 45%; left: -60%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); animation: aandi-sheen 6.5s ease-in-out infinite; }
      @keyframes aandi-sheen { 0% { left: -60%; } 55%, 100% { left: 135%; } }
      .rise { animation: aandi-rise 0.9s cubic-bezier(0.2,0.8,0.2,1) both; }
      @keyframes aandi-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      .fillbar { animation: aandi-fill 3.6s linear forwards; }
      @keyframes aandi-fill { from { width: 0%; } to { width: 100%; } }

      /* effects */
      .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.9s cubic-bezier(0.2,0.8,0.2,1), transform 0.9s cubic-bezier(0.2,0.8,0.2,1); }
      .reveal[data-in] { opacity: 1; transform: none; }
      .reveal-img { clip-path: inset(0 0 100% 0); transition: clip-path 1.05s cubic-bezier(0.7,0,0.2,1); }
      .reveal-img[data-in] { clip-path: inset(0 0 0 0); }
      .ulink { position: relative; }
      .ulink::after { content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1px; background: ${T.gold}; transform: scaleX(0); transform-origin: right; transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1); }
      .ulink:hover::after { transform: scaleX(1); transform-origin: left; }
      .btn { position: relative; overflow: hidden; }
      .btn > span { position: relative; z-index: 1; transition: color 0.4s ease; }
      .btn::before { content: ""; position: absolute; inset: 0; z-index: 0; background: var(--sweep, ${T.gold}); transform: translateX(-101%); transition: transform 0.5s cubic-bezier(0.2,0.8,0.2,1); }
      .btn:hover::before { transform: translateX(0); }
      .btn:hover > span { color: var(--sweeptext, ${T.ink}); }
      .fx-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0; background: ${T.gold}; z-index: 100; transition: width 0.1s linear; }
      .fx-grain { position: fixed; inset: 0; pointer-events: none; z-index: 90; opacity: 0.05; background-image: radial-gradient(rgba(0,0,0,0.9) 0.5px, transparent 0.6px); background-size: 3px 3px; }
      .fx-vignette { position: fixed; inset: 0; pointer-events: none; z-index: 89; background: radial-gradient(115% 100% at 50% 42%, transparent 60%, rgba(28,26,24,0.09) 100%); }

      @media (max-width: 900px) {
        .nav-links { display: none !important; }
        .nav-burger { display: inline-block !important; }
        .util-hide { display: none !important; }
        .hero { grid-template-columns: 1fr !important; min-height: auto !important; }
        .hero-plates { grid-template-rows: 1fr 1fr !important; min-height: 50vh; }
        .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
        .grid-3 { grid-template-columns: 1fr !important; }
        .grid-2, .grid-foot, .pdp { grid-template-columns: 1fr !important; }
        .pdp-gallery { position: static !important; }
        .look-wide { grid-column: span 2 !important; }
        .look-img { order: 1 !important; }
        .look-txt { order: 2 !important; }
        .style-row { grid-template-columns: 1fr !important; gap: 4px !important; }
        .co-row { flex-direction: column !important; }
        .co-summary { position: static !important; }
      }
      @media (max-width: 560px) {
        .grid-4 { grid-template-columns: 1fr 1fr !important; }
        .grid-foot { grid-template-columns: 1fr 1fr !important; }
        .wl-row { flex-direction: column; }
        .wl-row input { border-right: 1px solid ${T.border} !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        * { scroll-behavior: auto !important; }
        .marquee { animation: none !important; }
        .kb, .sheen::before, .rise, .fillbar { animation: none !important; }
        .reveal, .reveal-img { opacity: 1 !important; transform: none !important; clip-path: none !important; transition: none !important; }
        .ulink::after, .btn::before { transition: none !important; }
      }
    `}</style>
  );
}
