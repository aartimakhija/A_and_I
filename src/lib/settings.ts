import { prisma } from "@/lib/prisma";

export type SiteSettingsData = Awaited<ReturnType<typeof getSiteSettings>>;

/** Fetch the one SiteSettings row, creating it with defaults on first call. */
export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: "singleton" } });
  }
  return settings;
}
