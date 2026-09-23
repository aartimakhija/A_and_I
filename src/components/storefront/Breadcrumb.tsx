import Link from "next/link";

export function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="shell pt-4">
      <ol className="micro flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-border">/</span>}
            {i === items.length - 1 ? (
              <span className="text-foreground">{item.name}</span>
            ) : (
              <Link href={item.path} className="link-underline">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
