import { NextResponse } from "next/server";
import { getSession } from "@/lib/rbac";
import { ensureReferralCode, getReferralRewards } from "@/lib/referral";

export async function GET() {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "sign in required" }, { status: 401 });

  const code = await ensureReferralCode(session.userId);
  const rewards = await getReferralRewards(session.userId);

  return NextResponse.json({
    code,
    link: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/?ref=${code}`,
    rewards,
  });
}
