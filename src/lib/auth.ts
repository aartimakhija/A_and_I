import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(c, request) {
        const email = String(c?.email || "").toLowerCase();

        // Brute-force / credential-stuffing guard. Two keys: per-IP (catches an
        // attacker spraying many emails from one place) and per-email (catches
        // distributed attempts against one account). Both count every attempt,
        // not just failures, so this stays a stopgap same as the rest of
        // src/lib/rate-limit.ts's honest limitation — swap for a durable store
        // for real protection.
        const ip = clientIp(request);
        const ipLimit = rateLimit(`login-ip:${ip}`, 20, 10 * 60 * 1000);
        const emailLimit = rateLimit(`login-email:${email}`, 8, 10 * 60 * 1000);
        if (!ipLimit.ok || !emailLimit.ok) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(String(c?.password || ""), user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role, vendorId: user.vendorId } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = (user as any).role; token.vendorId = (user as any).vendorId; token.uid = (user as any).id; }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role;
      (session as any).vendorId = token.vendorId;
      (session.user as any).id = token.uid;
      return session;
    },
  },
});
