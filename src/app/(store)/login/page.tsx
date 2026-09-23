"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <main className="shell flex min-h-[70vh] max-w-sm flex-col justify-center py-16">
      <h1 className="display-md mb-6">Sign in</h1>
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-line mb-3" />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-line mb-5" />
      <button onClick={() => signIn("credentials", { email, password, callbackUrl: "/" })} className="btn-solid-gold w-full">
        Sign in
      </button>
      <p className="mt-4 text-xs text-muted-foreground">Admin → /admin · Vendor → /vendor (scoped)</p>
    </main>
  );
}
