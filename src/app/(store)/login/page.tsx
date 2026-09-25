"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res || res.error) {
        setError("Incorrect email or password.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next || "/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell flex min-h-[70vh] max-w-sm flex-col justify-center py-16">
      <h1 className="display-md mb-6">Sign in</h1>
      <form onSubmit={onSubmit}>
        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}
        <input
          placeholder="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-line mb-3"
        />
        <input
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-line mb-5"
        />
        <button type="submit" disabled={loading} className="btn-solid-gold w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
