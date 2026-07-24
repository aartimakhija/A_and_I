import { getSiteSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettings() {
  const settings = await getSiteSettings();
  return (
    <>
      <h1>Settings</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Site-wide controls — favicon, social links, SEO, and analytics, no code required.</p>
      <div style={{ marginTop: 24 }}>
        <SettingsForm initial={settings} />
      </div>
    </>
  );
}
