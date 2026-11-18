"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useDeck } from "@/hooks/useDeck";
import { useDemoUser } from "@/hooks/useDemoUser";
import { useSwipeKeys } from "@/hooks/useSwipeKeys";
import { MatchModal } from "@/components/match/MatchModal";
import { ActionButtons } from "./ActionButtons";
import { DeckSkeleton } from "./DeckSkeleton";
import { DeckError, EmptyDeck } from "./DeckMessage";
import { DiscoverHints, DiscoverProgress } from "./DiscoverSidebar";
import { SwipeDeck } from "./SwipeDeck";

/** The Discover tab: card deck, action buttons, desktop side panels and match celebration. */
export function DiscoverView() {
  const router = useRouter();
  const me = useDemoUser();
  const deck = useDeck();

  useSwipeKeys(deck.swipe);

  const canSwipe = deck.status === "ready" && deck.profiles.length > 0 && !deck.busy && !deck.match;

  return (
    <div className="grid gap-8 pt-1 lg:grid-cols-[1fr_minmax(0,440px)_1fr] lg:gap-10">
      <DiscoverProgress reviewed={deck.reviewed} total={deck.initialTotal} />

      <section aria-label="Discover" className="mx-auto w-full max-w-[440px]">
        {/* Card height adapts to the viewport so the buttons never fall off-screen */}
        <div style={{ height: "clamp(420px, calc(100dvh - 17.5rem), 700px)" }} className="relative">
          {deck.status === "loading" && <DeckSkeleton />}
          {deck.status === "error" && <DeckError message={deck.errorMessage} onRetry={deck.reload} />}
          {deck.status === "ready" && deck.profiles.length === 0 && <EmptyDeck onReset={deck.reload} />}
          {deck.status === "ready" && deck.profiles.length > 0 && (
            <SwipeDeck
              profiles={deck.profiles}
              busy={deck.busy || deck.match !== null}
              exitDirection={deck.exitDirection}
              onSwipe={deck.swipe}
            />
          )}
        </div>

        <ActionButtons
          disabled={!canSwipe}
          onPass={() => deck.swipe("pass")}
          onLike={() => deck.swipe("like")}
        />
      </section>

      <DiscoverHints onReset={deck.reload} />

      <AnimatePresence>
        {deck.match && (
          <MatchModal
            me={me}
            match={deck.match}
            onContinue={deck.dismissMatch}
            onViewMatches={() => {
              deck.dismissMatch();
              router.push("/matches");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
