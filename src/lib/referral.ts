import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";

const gen = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

/** Ensures the given user has a permanent, shareable referral code + matching PromoCode, creating them on first use. */
export async function ensureReferralCode(userId: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("user not found");

  if (!user.referralCode) {
    const code = `FRIEND-${gen()}`;
    user = await prisma.user.update({ where: { id: user.id }, data: { referralCode: code } });
    await prisma.promoCode.create({
      data: { code, percentOff: 10, source: "REFERRAL", referrerUserId: user.id, maxRedemptions: 9999 },
    });
  }
  return user.referralCode!;
}

export async function getReferralRewards(userId: string) {
  const rewards = await prisma.promoCode.findMany({ where: { rewardForUserId: userId }, orderBy: { createdAt: "desc" } });
  return rewards.map((r) => ({ code: r.code, percentOff: r.percentOff, used: r.redemptions >= r.maxRedemptions, active: r.active }));
}
