"use client";
import { T, SANS } from "./theme";

export function CField({ label, value, onChange, error, mono, ...rest }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; mono?: boolean;
  [key: string]: any;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>{label}</span>
      <input value={value} onChange={onChange} {...rest}
        style={{ width: "100%", marginTop: 6, padding: "12px 14px", fontFamily: mono ? "ui-monospace, monospace" : SANS,
          fontSize: 14, color: T.ink, background: T.card, borderRadius: 2, outline: "none",
          border: `1px solid ${error ? "#B0503E" : T.border}`, letterSpacing: mono ? 1 : 0 }} />
      {error && <span style={{ fontFamily: SANS, fontSize: 10, color: "#B0503E", marginTop: 4, display: "block" }}>{error}</span>}
    </label>
  );
}

export function CSelect({ label, value, onChange, error, options, disabled, placeholder }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; error?: string;
  options: string[]; disabled?: boolean; placeholder?: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.stone }}>{label}</span>
      <select value={value} onChange={onChange} disabled={disabled}
        style={{ width: "100%", marginTop: 6, padding: "12px 14px", fontFamily: SANS,
          fontSize: 14, color: disabled ? T.stone : T.ink, background: disabled ? T.linen : T.card, borderRadius: 2, outline: "none",
          border: `1px solid ${error ? "#B0503E" : T.border}` }}>
        <option value="">{placeholder || `Select ${label.toLowerCase()}…`}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span style={{ fontFamily: SANS, fontSize: 10, color: "#B0503E", marginTop: 4, display: "block" }}>{error}</span>}
    </label>
  );
}
