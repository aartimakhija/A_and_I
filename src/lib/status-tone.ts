// Plain, server-safe status → badge-color mapping.
//
// This used to live in src/components/admin/ui.tsx, which is a "use client"
// file. That was fine for client components calling it, but two admin pages
// (the product edit page and the vendors page) are Server Components that
// called it directly as a plain function — not rendered as JSX. Next.js
// turns EVERY export of a "use client" module into an opaque client
// reference when a Server Component imports it, including plain utility
// functions with no React in them. Calling that reference throws
// "X is not a function" in the production build (dev is more forgiving,
// which is why this only ever showed up on Vercel). Component exports
// (Badge, Button, PageHeader, ...) were fine because they're used as JSX,
// which Next.js knows how to bridge across the boundary — only a bare
// function call breaks. Keeping these two functions in a plain module lets
// both Server Components and Client Components import and call them
// directly with no boundary issue either way.
export type BadgeTone = "green" | "amber" | "red" | "blue" | "gray";

export function productStatusTone(status: string): BadgeTone {
  switch (status) {
    case "ACTIVE": return "green";
    case "DRAFT": return "gray";
    case "SOLD_OUT": return "amber";
    case "ARCHIVED": return "red";
    default: return "gray";
  }
}

export function vendorStatusTone(status: string): BadgeTone {
  switch (status) {
    case "APPROVED": return "green";
    case "PENDING": return "amber";
    case "SUSPENDED": return "red";
    default: return "gray";
  }
}
