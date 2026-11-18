import Link from "next/link";
import { CloudOff, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ResetDemoButton } from "@/components/ui/ResetDemoButton";
import { buttonStyles } from "@/components/ui/button-styles";

function Frame({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-[28px] bg-white/70 px-8 text-center shadow-soft ring-1 ring-ink/5 backdrop-blur">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-blush text-rose-500">
        {icon}
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

/** Shown when every profile has been swiped. */
export function EmptyDeck({ onReset }: { onReset: () => void }) {
  return (
    <Frame icon={<Sparkles className="h-7 w-7" aria-hidden />} title="You're all caught up">
      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-ink-muted">
        That's everyone for now. Fresh faces show up here as they join — check your matches while you wait.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/matches" className={buttonStyles({ variant: "primary" })}>
          <Heart className="h-4 w-4" aria-hidden />
          View matches
        </Link>
        <ResetDemoButton variant="secondary" onReset={onReset} />
      </div>
    </Frame>
  );
}

/** Shown when the feed request fails. */
export function DeckError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Frame icon={<CloudOff className="h-7 w-7" aria-hidden />} title="Couldn't load profiles">
      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-ink-muted">{message}</p>
      <Button className="mt-6" onClick={onRetry}>
        Try again
      </Button>
    </Frame>
  );
}
