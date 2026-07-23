"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  return (
    <main style={{ maxWidth: 360, margin: "80px auto", fontFamily: "system-ui" }}>
      <h1>Sign in</h1>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 12, margin: "8px 0" }} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 12, margin: "8px 0" }} />
      <button onClick={() => signIn("credentials", { email, password, callbackUrl: "/" })} style={{ width: "100%", padding: 12, background: "#0a0a0a", color: "#fff", border: 0 }}>Sign in</button>
      <p style={{ fontSize: 12, color: "#878787" }}>Admin → /admin · Vendor → /vendor (scoped)</p>
    </main>
  );
}
