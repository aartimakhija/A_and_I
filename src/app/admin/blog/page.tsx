import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBlog() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Journal</h1>
        <Link href="/admin/blog/new" style={{ padding: "10px 20px", background: "#0a0a0a", color: "#fff", textDecoration: "none", fontSize: 13 }}>
          + New post
        </Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead><tr>{["Title", "Author", "Status", "Updated", ""].map((h) => <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>)}</tr></thead>
        <tbody>{posts.map((p) => (
          <tr key={p.id}>
            <td style={{ padding: 8 }}>{p.title}</td>
            <td>{p.authorName}</td>
            <td>{p.status}</td>
            <td style={{ fontSize: 12, color: "#666" }}>{new Date(p.updatedAt).toLocaleDateString("en-IN")}</td>
            <td><Link href={`/admin/blog/${p.id}/edit`} style={{ fontSize: 12, color: "#0a0a0a" }}>Edit</Link></td>
          </tr>
        ))}</tbody>
      </table>
      {posts.length === 0 && <p style={{ color: "#999", marginTop: 20 }}>No posts yet — write your first one.</p>}
    </>
  );
}
