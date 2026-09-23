"use client";
import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/** Single shared newsletter form, posts to /api/newsletter (NewsletterSubscriber). */
export function NewsletterForm({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong — please try again.");
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "success") {
    return <p className="micro text-primary">You&apos;re on the list — thank you.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm items-end gap-4">
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="field-line"
          disabled={status === "submitting"}
        />
      </div>
      <button type="submit" disabled={status === "submitting"} className="btn-outline-ink shrink-0">
        {status === "submitting" ? "Joining…" : "Join"}
      </button>
      {status === "error" && (
        <p role="alert" className="micro text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
