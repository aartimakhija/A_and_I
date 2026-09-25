"use client";
// src/components/admin/ui.tsx
//
// Small, shared set of admin UI primitives so every CMS screen (catalogue,
// product editor, vendors, …) looks and behaves consistently: real click
// targets, one badge/button/card language, one confirm-dialog pattern.
// Deliberately minimal — no external UI library, just Tailwind classes
// layered over the existing "ink on ivory" admin palette.

import Link from "next/link";
import { useEffect, useRef } from "react";

// ── Button ──────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-neutral-900 text-white border border-neutral-900 hover:bg-neutral-700",
  secondary: "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50",
  ghost: "bg-transparent text-neutral-600 border border-transparent hover:bg-neutral-100 hover:text-neutral-900",
  danger: "bg-white text-red-700 border border-red-200 hover:bg-red-50",
};
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
};

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = ButtonBaseProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

export function Button(props: ButtonProps) {
  const { variant = "secondary", size = "md", className = "", href, children, ...rest } = props as ButtonBaseProps & {
    href?: string;
  } & Record<string, any>;
  const cls = [
    "inline-flex items-center justify-center rounded-sm font-medium whitespace-nowrap select-none",
    "transition-colors disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1",
    VARIANT_CLASSES[variant as ButtonVariant],
    SIZE_CLASSES[size as ButtonSize],
    href ? "cursor-pointer" : "",
    className,
  ].join(" ");
  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={rest.type ?? "button"} className={cls} {...rest}>
      {children}
    </button>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────
// BadgeTone, productStatusTone and vendorStatusTone moved to
// "@/lib/status-tone" — this file has "use client" at the top, and a Server
// Component calling a plain function from a "use client" module (rather
// than rendering it as JSX) throws "X is not a function" in production.
// Re-exported here so existing imports of BadgeTone from this file still work.
export type { BadgeTone } from "@/lib/status-tone";
import type { BadgeTone } from "@/lib/status-tone";
const BADGE_CLASSES: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  gray: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export function Badge({ tone = "gray", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide whitespace-nowrap ${BADGE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}

// ── Card ────────────────────────────────────────────────────────────────
export function Card({
  title,
  description,
  actions,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`rounded-md border border-neutral-200 bg-white ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>}
            {description && <p className="mt-1 text-xs text-neutral-500">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

// ── Page header (title + back link + actions) ────────────────────────────
export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link
          href={backHref}
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900"
        >
          <span aria-hidden>←</span> {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-neutral-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

// ── Confirm / prompt dialog ───────────────────────────────────────────────
// A single small modal used for destructive confirmations and short forms
// (e.g. "reassign these products before deleting this vendor").
export function Modal({
  open,
  onClose,
  title,
  children,
  width = 420,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={ref} style={{ maxWidth: width }} className="w-full rounded-md bg-white p-5 shadow-xl">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

// ── Shared field styling helpers (kept for components not yet migrated) ──
export const fieldClass =
  "w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400";
export const labelClass = "block text-[11px] font-medium uppercase tracking-wide text-neutral-500";
