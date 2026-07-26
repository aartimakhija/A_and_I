"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Hit = { type: string; label: string; sublabel?: string; href: string };
type Notification = { id: string; type: string; message: string; href: string; severity: "info" | "warning" | "urgent" };

export default function AdminHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/notifications").then((r) => r.json()).then((d) => setNotifications(d.notifications || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setHits([]); return; }
    setSearching(true);
    const t = setTimeout(() => {
      fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json()).then((d) => setHits(d.hits || []))
        .finally(() => setSearching(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(href: string) {
    setSearchOpen(false); setQuery("");
    router.push(href);
  }

  const severityColor = { urgent: "#B0503E", warning: "#8a6d1a", info: "#666" };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #eee", background: "#fff" }}>
      <div ref={searchRef} style={{ position: "relative", width: 360 }}>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search products, orders, vendors, materials…"
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", fontSize: 13 }}
        />
        {searchOpen && query.trim().length >= 2 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ddd", marginTop: 4, maxHeight: 360, overflowY: "auto", zIndex: 50 }}>
            {searching && <div style={{ padding: 10, fontSize: 12, color: "#999" }}>Searching…</div>}
            {!searching && hits.length === 0 && <div style={{ padding: 10, fontSize: 12, color: "#999" }}>No results</div>}
            {hits.map((h, i) => (
              <button key={i} onClick={() => go(h.href)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", borderBottom: "1px solid #f5f5f5", background: "none", cursor: "pointer" }}>
                <span style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#999" }}>{h.type}</span>
                <div style={{ fontSize: 13 }}>{h.label}{h.sublabel && <span style={{ color: "#999" }}> — {h.sublabel}</span>}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={notifRef} style={{ position: "relative" }}>
        <button onClick={() => setNotifOpen((o) => !o)} style={{ background: "none", border: "1px solid #ddd", padding: "8px 14px", cursor: "pointer", fontSize: 13, position: "relative" }}>
          Notifications
          {notifications.length > 0 && (
            <span style={{ position: "absolute", top: -6, right: -6, background: "#B0503E", color: "#fff", borderRadius: "50%", fontSize: 10, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {notifications.length}
            </span>
          )}
        </button>
        {notifOpen && (
          <div style={{ position: "absolute", top: "100%", right: 0, background: "#fff", border: "1px solid #ddd", marginTop: 4, width: 360, maxHeight: 400, overflowY: "auto", zIndex: 50 }}>
            {notifications.length === 0 && <div style={{ padding: 14, fontSize: 12, color: "#999" }}>Nothing needs your attention right now.</div>}
            {notifications.map((n) => (
              <button key={n.id} onClick={() => { setNotifOpen(false); router.push(n.href); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", border: "none", borderBottom: "1px solid #f5f5f5", background: "none", cursor: "pointer" }}>
                <span style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: severityColor[n.severity] }}>{n.type}</span>
                <div style={{ fontSize: 13 }}>{n.message}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
