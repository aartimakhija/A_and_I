// Contact form submissions — the other end of the /contact page
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const TOPIC_LABEL: Record<string, string> = {
  general: "General", wholesale: "Wholesale", press: "Press", vendor: "Vendor inquiry",
};

export default async function AdminMessages() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <h1>Messages</h1>
      <p style={{ color: "#666", marginTop: -8 }}>
        Submissions from the public Contact page.{unreadCount > 0 && ` ${unreadCount} unread.`}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Date", "Name", "Email", "Topic", "Message"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{messages.map((m) => (
          <tr key={m.id} style={{ opacity: m.read ? 0.65 : 1, cursor: "pointer" }}>
            <td style={{ padding: 0 }} colSpan={5}>
              <Link href={`/admin/messages/${m.id}`} style={{ display: "grid", gridTemplateColumns: "160px 140px 220px 110px 1fr", padding: "8px 0", textDecoration: "none", color: "inherit", alignItems: "start" }}>
                <span style={{ fontSize: 12, whiteSpace: "nowrap", paddingLeft: 8 }}>
                  {!m.read && <strong>●&nbsp;</strong>}
                  {new Date(m.createdAt).toLocaleString("en-IN")}
                </span>
                <span style={{ fontWeight: m.read ? 400 : 600 }}>{m.name}</span>
                <span>{m.email}</span>
                <span>{TOPIC_LABEL[m.topic] ?? m.topic}</span>
                <span style={{ maxWidth: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#666" }}>{m.message}</span>
              </Link>
            </td>
          </tr>
        ))}</tbody>
      </table>
      {messages.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No messages yet.</p>}
    </>
  );
}
