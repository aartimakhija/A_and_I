import { buildSitemap } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap() { return buildSitemap() as any; }
