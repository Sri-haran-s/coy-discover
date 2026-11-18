import Link from "next/link";
import { cn } from "@/lib/utils";

/** The Coy mark: an open "C" with a small dot — a glance held just a moment too long. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-9 w-9", className)} aria-hidden>
      <defs>
        <linearGradient id="coy-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7707F" />
          <stop offset="1" stopColor="#CF3A55" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#coy-mark)" />
      <path
        d="M20.5 10.2A7.2 7.2 0 1 0 20.5 21.8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="22.2" cy="16" r="1.9" fill="#fff" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Coy Discover — home"
      className={cn("inline-flex items-center gap-2.5 rounded-xl", className)}
    >
      <LogoMark />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="font-display text-[1.45rem] font-semibold italic tracking-tight">Coy</span>
        <span className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-ink-muted">
          Discover
        </span>
      </span>
    </Link>
  );
}
