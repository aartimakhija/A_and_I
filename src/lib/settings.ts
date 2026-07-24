import { prisma } from "@/lib/prisma";

const FALLBACK = {
  id: "singleton", siteName: "A&I", tagline: "Style With Us",
  description: "Indian craft, global silhouette. Womenswear handmade in small runs across India.",
  faviconUrl: null, logoUrl: null, ogImageUrl: null, announcementText: "Made in India, in small runs",
  socialInstagram: null, socialWhatsapp: null, socialPinterest: null, socialFacebook: null, socialTwitter: null,
  contactEmail: null, contactPhone: null, gaMeasurementId: null, googleSiteVerification: null, bingSiteVerification: null,
  updatedAt: new Date(),
} as const;

export type SiteSettingsData = Awaited<ReturnType<typeof getSiteSettings>>;

/**
 * Fetch the one SiteSettings row, creating it with defaults on first call.
 * Falls back to hardcoded defaults on any DB error rather than throwing —
 * this runs on every single request via the root layout, so a transient
 * database hiccup here must never take down the entire site.
 */
export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "singleton" } });
    }
    return settings;
  } catch {
    return FALLBACK as any;
  }
}
