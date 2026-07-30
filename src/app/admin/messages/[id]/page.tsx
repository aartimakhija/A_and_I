import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import MessageActions from "@/components/admin/MessageActions";

const TOPIC_LABEL: Record<string, string> = {
  general: "General", wholesale: "Wholesale", press: "Press", vendor: "Vendor inquiry",
};

export default async function MessageDetail({ params }: { params: { id: string } }) {
  const message = await prisma.contactMessage.findUnique({ where: { id: params.id } });
  if (!message) notFound();

  // Viewing a message marks it read — matches how every email client behaves.
  if (!message.read) {
    await prisma.contactMessage.update({ where: { id: message.id }, data: { read: true } });
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/admin/messages" style={{ fontSize: 12, color: "#666" }}>← Back to Messages</Link>

      <div style={{ background: "#fff", border: "1px solid #eee", padding: 24, marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{message.name}</div>
            <a href={`mailto:${message.email}`} style={{ fontSize: 13, color: "#0a0a0a" }}>{message.email}</a>
          </div>
          <span style={{ fontSize: 11, padding: "4px 10px", background: "#f0ece4", borderRadius: 3 }}>{TOPIC_LABEL[message.topic] ?? message.topic}</span>
        </div>

        <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
          {new Date(message.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 20, whiteSpace: "pre-wrap" }}>{message.message}</p>

        <div style={{ marginTop: 20 }}>
          <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: your message to A&I`)}`}
            style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", textDecoration: "none", fontSize: 13, display: "inline-block" }}>
            Reply by email
          </a>
        </div>

        <MessageActions id={message.id} />
      </div>
    </div>
  );
}
