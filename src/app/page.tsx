import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { ResetDemoButton } from "@/components/ui/ResetDemoButton";
import { buttonStyles } from "@/components/ui/button-styles";

/** Quiet stacked-card illustration used as the Home placeholder. */
function PlaceholderStack() {
  return (
    <div aria-hidden className="relative mx-auto h-[21rem] w-[16rem] animate-float">
      <div className="absolute inset-0 -rotate-[8deg] rounded-[28px] bg-blush/80 shadow-soft" />
      <div className="absolute inset-0 rotate-[5deg] rounded-[28px] bg-cream-300/80 shadow-soft" />
      <div className="absolute inset-0 flex flex-col rounded-[28px] bg-white p-4 shadow-lift ring-1 ring-ink/5">
        <div className="grid flex-1 place-items-center rounded-2xl bg-gradient-to-br from-rose-100 via-blush to-cream-200">
          <LogoMark className="h-16 w-16 drop-shadow-sm" />
        </div>
        <div className="space-y-2.5 pt-4">
          <div className="h-3 w-28 rounded-full bg-ink/10" />
          <div className="h-2.5 w-40 rounded-full bg-ink/5" />
          <div className="flex gap-1.5 pt-1">
            <div className="h-5 w-14 rounded-full bg-rose-100" />
            <div className="h-5 w-16 rounded-full bg-cream-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="grid items-center gap-10 py-6 md:grid-cols-2 md:gap-6 md:py-14">
      <div className="space-y-6 text-center md:text-left">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-600">Welcome to Coy Discover</p>
        <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Meet people, <span className="italic text-rose-500">quietly.</span>
        </h1>
        <p className="mx-auto max-w-md text-[17px] leading-relaxed text-ink-muted md:mx-0">
          Like the people who catch your eye. We only reveal a like when it's mutual — no pressure,
          no guessing games, just a match when the feeling is shared.
        </p>

        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center md:justify-start">
          <Link href="/discover" className={buttonStyles({ size: "lg" })}>
            Start discovering
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/matches" className={buttonStyles({ variant: "secondary", size: "lg" })}>
            <Heart className="h-4 w-4 text-rose-500" aria-hidden />
            Your matches
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4 text-sm text-ink-muted md:justify-start">
          <span>Replaying the demo?</span>
          <ResetDemoButton variant="ghost" />
        </div>
      </div>

      <PlaceholderStack />
    </div>
  );
}
