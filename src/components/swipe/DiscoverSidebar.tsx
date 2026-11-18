import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { ResetDemoButton } from "@/components/ui/ResetDemoButton";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid h-7 min-w-7 place-items-center rounded-md bg-white px-1.5 text-ink-soft shadow-soft ring-1 ring-ink/10">
      {children}
    </kbd>
  );
}

/** Left column (desktop): how far through the feed the user is. */
export function DiscoverProgress({ reviewed, total }: { reviewed: number; total: number }) {
  const percent = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  return (
    <aside className="hidden lg:block" aria-label="Discovery progress">
      <div className="ml-auto max-w-[15rem] space-y-4 pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Today's feed</p>
        <p className="font-display text-5xl font-semibold tracking-tight">
          {reviewed}
          <span className="text-2xl font-normal text-ink-faint"> / {total}</span>
        </p>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-ink/10"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profiles reviewed"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-300 to-rose-500 transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-sm leading-relaxed text-ink-muted">Profiles reviewed. Take your time — there's no rush here.</p>
      </div>
    </aside>
  );
}

/** Right column (desktop): shortcuts, the privacy promise and demo tools. */
export function DiscoverHints({ onReset }: { onReset: () => void }) {
  return (
    <aside className="hidden space-y-7 pt-6 lg:block" aria-label="Tips">
      <div className="max-w-[16rem] space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Shortcuts</p>
        <ul className="space-y-2.5 text-sm text-ink-soft">
          <li className="flex items-center gap-3">
            <Kbd><ArrowLeft className="h-3.5 w-3.5" aria-hidden /></Kbd> Pass
          </li>
          <li className="flex items-center gap-3">
            <Kbd><ArrowRight className="h-3.5 w-3.5" aria-hidden /></Kbd> Like
          </li>
        </ul>
        <p className="text-sm leading-relaxed text-ink-muted">Or drag the card — right to like, left to pass.</p>
      </div>

      <div className="max-w-[16rem] space-y-2 rounded-2xl bg-white/60 p-4 ring-1 ring-ink/5">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-rose-500" aria-hidden />
          Private by design
        </p>
        <p className="text-sm leading-relaxed text-ink-muted">
          A like is only ever revealed when it's mutual. Nobody sees who liked them first.
        </p>
      </div>

      <div className="max-w-[16rem] space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Demo</p>
        <ResetDemoButton onReset={onReset} />
      </div>
    </aside>
  );
}
