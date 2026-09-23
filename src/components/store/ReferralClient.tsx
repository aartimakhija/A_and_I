"use client";
import { useState } from "react";

export function ReferralClient({ code, link, rewards }: {
  code: string; link: string; rewards: { code: string; percentOff: number; used: boolean; active: boolean }[];
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="mt-6">
      <div className="border border-border bg-card p-5">
        <div className="eyebrow-muted">Your code</div>
        <div className="my-1.5 font-mono text-xl tracking-wide">{code}</div>
        <div className="flex gap-2">
          <input readOnly value={link} onClick={(e) => (e.target as HTMLInputElement).select()} className="flex-1 border border-border bg-background px-3 py-2.5 text-sm" />
          <button onClick={copy} className="btn-solid-gold whitespace-nowrap px-4.5">
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </div>

      <h2 className="display-md mt-8 text-lg">Rewards earned</h2>
      {rewards.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">None yet — share your link above. Once a friend&apos;s first order comes through, a 10% code shows up here.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {rewards.map((r) => (
            <div key={r.code} className="flex justify-between border border-border bg-card px-3.5 py-2.5">
              <span className="font-mono text-sm">{r.code}</span>
              <span className={`text-xs ${r.used ? "text-muted-foreground" : "text-primary"}`}>{r.used ? "Used" : `${r.percentOff}% off — ready to use`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
