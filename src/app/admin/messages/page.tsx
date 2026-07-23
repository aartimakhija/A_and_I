// Contact form submissions — the other end of the /contact page
import { prisma } from "@/lib/prisma";

const TOPIC_LABEL: Record<string, string> = {
  general: "General", wholesale: "Wholesale", press: "Press", vendor: "Vendor inquiry",
};

export default async function AdminMessages() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <>
      <h1>Messages</h1>
      <p style={{ color: "#666", marginTop: -8 }}>Submissions from the public Contact page.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Date", "Name", "Email", "Topic", "Message"].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{messages.map((m) => (
          <tr key={m.id} style={{ opacity: m.read ? 0.6 : 1 }}>
            <td style={{ padding: 8, fontSize: 12, whiteSpace: "nowrap" }}>{new Date(m.createdAt).toLocaleString("en-IN")}</td>
            <td>{m.name}</td>
            <td>{m.email}</td>
            <td>{TOPIC_LABEL[m.topic] ?? m.topic}</td>
            <td style={{ maxWidth: 420 }}>{m.message}</td>
          </tr>
        ))}</tbody>
      </table>
      {messages.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No messages yet.</p>}
    </>
  );
}
