/** Scrolling brand-keyword strip, ported from the new design's home marquee. */
export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-paper-foreground/10 bg-paper py-3.5">
      <div className="inline-flex animate-marquee motion-reduce:animate-none">
        {loop.map((m, i) => (
          <span key={i} className="micro px-9 font-light text-paper-muted">
            {m}
            <span className="ml-9 text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
