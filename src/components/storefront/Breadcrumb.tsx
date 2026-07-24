"use client";
import Link from "next/link";
import { T, SANS } from "./theme";

export function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 1320, margin: "0 auto", padding: "16px clamp(20px,4vw,48px) 0" }}>
      <ol style={{ display: "flex", flexWrap: "wrap", gap: 6, listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item, i) => (
          <li key={item.path} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <span style={{ color: T.border, fontSize: 11 }}>/</span>}
            {i === items.length - 1 ? (
              <span style={{ fontFamily: SANS, fontSize: 11, color: T.stone }}>{item.name}</span>
            ) : (
              <Link href={item.path} className="ulink" style={{ fontFamily: SANS, fontSize: 11, color: T.stone, textDecoration: "none" }}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
