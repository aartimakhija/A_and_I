"use client";

export function CField({ label, value, onChange, error, mono, ...rest }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; mono?: boolean;
  [key: string]: any;
}) {
  return (
    <label className="block">
      <span className="eyebrow-muted">{label}</span>
      <input
        value={value}
        onChange={onChange}
        {...rest}
        className={`mt-1.5 w-full border bg-card px-3.5 py-3 text-sm text-foreground outline-none ${mono ? "font-mono tracking-wide" : ""} ${error ? "border-destructive" : "border-border focus:border-primary"}`}
      />
      {error && <span className="mt-1 block text-[10px] text-destructive">{error}</span>}
    </label>
  );
}

export function CSelect({ label, value, onChange, error, options, disabled, placeholder }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; error?: string;
  options: string[]; disabled?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow-muted">{label}</span>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1.5 w-full border px-3.5 py-3 text-sm outline-none ${disabled ? "bg-secondary text-muted-foreground" : "bg-card text-foreground"} ${error ? "border-destructive" : "border-border focus:border-primary"}`}
      >
        <option value="">{placeholder || `Select ${label.toLowerCase()}…`}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span className="mt-1 block text-[10px] text-destructive">{error}</span>}
    </label>
  );
}
