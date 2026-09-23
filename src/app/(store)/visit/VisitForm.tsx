"use client";
import { useState } from "react";
import Link from "next/link";

export function VisitForm() {
  const [email, setEmail] = useState("");
  const [when, setWhen] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const nextError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Please enter a valid email address."
      : !when.trim()
        ? "Please tell us the city and roughly when."
        : "";
    setError(nextError);
    if (nextError) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0],
          email,
          topic: "general",
          message: `Studio visit request — city and dates: ${when}`,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setError("Something went wrong sending that — please try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <form className="mt-9 space-y-6" noValidate onSubmit={submit}>
        <p className="micro text-paper-muted">
          Both fields <span aria-hidden="true">*</span> required
        </p>
        <div>
          <label htmlFor="visit-email" className="micro text-paper-muted">
            Email address <span aria-hidden="true" className="text-accent">*</span>
          </label>
          <input
            id="visit-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="field-line mt-3 w-full text-paper-foreground"
          />
        </div>
        <div>
          <label htmlFor="visit-city" className="micro text-paper-muted">
            City and rough dates <span aria-hidden="true" className="text-accent">*</span>
          </label>
          <input
            id="visit-city"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="Mumbai, late October"
            className="field-line mt-3 w-full text-paper-foreground"
          />
        </div>
        <button type="submit" className="btn-outline-ink" disabled={status !== "idle"}>
          {status === "submitting" ? "Sending…" : "Request an appointment"}
        </button>
        <p aria-live="polite" className="text-sm text-accent">
          {error ? error : status === "sent" ? "Received — we'll come back with dates within two working days." : ""}
        </p>
      </form>
      <Link href="/fit-quiz" className="link-underline micro mt-9 inline-block text-paper-foreground">
        Or find your fit online
      </Link>
    </>
  );
}
