"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { PublicProfile, SwipeAction } from "@/types";
import { SwipeCard } from "./SwipeCard";

interface SwipeDeckProps {
  profiles: PublicProfile[];
  busy: boolean;
  /** 1 = the departing card flies right (like), -1 = left (pass). */
  exitDirection: 1 | -1;
  onSwipe: (action: SwipeAction) => void;
}

/** Shows the current card with the next one peeking from behind. */
export function SwipeDeck({ profiles, busy, exitDirection, onSwipe }: SwipeDeckProps) {
  const visible = profiles.slice(0, 2);

  // Warm the browser cache so the next few photos are ready before they're needed.
  useEffect(() => {
    profiles.slice(0, 4).forEach((p) => {
      const img = new Image();
      img.src = p.photoUrl;
    });
  }, [profiles]);

  return (
    <div className="relative h-full w-full" role="group" aria-roledescription="carousel" aria-label="Profiles">
      <AnimatePresence custom={exitDirection} initial={false}>
        {/* Reversed so the top card is last in the DOM (painted on top). Keys keep
            each card's identity stable when it is promoted from "next" to "top". */}
        {[...visible].reverse().map((profile) => (
          <SwipeCard
            key={profile.id}
            profile={profile}
            isTop={profile.id === visible[0].id}
            locked={busy}
            onSwipe={onSwipe}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
