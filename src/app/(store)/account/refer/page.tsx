import { getSession } from "@/lib/rbac";
import { ensureReferralCode, getReferralRewards } from "@/lib/referral";
import { redirect } from "next/navigation";
import { ReferralClient } from "@/components/store/ReferralClient";

export default async function ReferPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login?next=/account/refer");

  const code = await ensureReferralCode(session.userId);
  const rewards = await getReferralRewards(session.userId);
  const link = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/?ref=${code}`;

  return (
    <main className="shell max-w-2xl py-12">
      <h1 className="display-md">Give 10%, get 10%</h1>
      <p className="mt-2 text-sm text-muted-foreground">Share your link. When a friend uses it on their first order, they get 10% off — and you get a 10% code of your own.</p>
      <ReferralClient code={code} link={link} rewards={rewards} />
    </main>
  );
}
