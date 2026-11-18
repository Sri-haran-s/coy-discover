"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { DemoUser, MatchItem } from "@/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/Button";

interface MatchModalProps {
  me: DemoUser | null;
  match: MatchItem;
  onContinue: () => void;
  onViewMatches: () => void;
}

// Fixed positions (not random) so the effect is identical on every render.
const SPARKS = [
  { left: "8%", size: 6, delay: 0.1, duration: 4.2 },
  { left: "18%", size: 9, delay: 1.2, duration: 5.1 },
  { left: "29%", size: 5, delay: 0.6, duration: 4.6 },
  { left: "41%", size: 8, delay: 2.0, duration: 5.4 },
  { left: "55%", size: 6, delay: 0.3, duration: 4.4 },
  { left: "66%", size: 10, delay: 1.5, duration: 5.2 },
  { left: "77%", size: 5, delay: 0.9, duration: 4.0 },
  { left: "88%", size: 8, delay: 1.9, duration: 4.8 },
];

function Avatar({ src, name, rotate }: { src?: string; name: string; rotate: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: rotate < 0 ? -60 : 60, rotate: 0 }}
      animate={{ opacity: 1, x: 0, rotate }}
      transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.15 }}
      className="h-36 w-36 overflow-hidden rounded-[2rem] shadow-card ring-4 ring-white sm:h-44 sm:w-44"
    >
      <SmartImage src={src ?? ""} alt={`Photo of ${name}`} fallbackName={name} priority />
    </motion.div>
  );
}

/** Full-screen "It's a match!" celebration. */
export function MatchModal({ me, match, onContinue, onViewMatches }: MatchModalProps) {
  const { profile } = match;

  // Escape dismisses; lock page scroll while the overlay is open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onContinue();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onContinue]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#2A2021] via-[#2B1D22] to-[#4A1F2B] px-6 text-white"
    >
      {/* Slow pulsing rings behind the photos */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute h-72 w-72 rounded-full border border-rose-300/30"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 2.2], opacity: [0.5, 0] }}
          transition={{ duration: 4, delay: i * 1.3, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* Drifting sparks */}
      {SPARKS.map((spark, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute bottom-0 rounded-full bg-rose-200/80"
          style={{ left: spark.left, width: spark.size, height: spark.size }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -700, opacity: [0, 0.9, 0] }}
          transition={{ duration: spark.duration, delay: spark.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative flex items-center justify-center">
          <Avatar src={me?.photoUrl} name={me?.name ?? "You"} rotate={-7} />
          {/* The wrapper centres the badge; framer-motion owns `transform` on the inner
              element, so centring must not rely on Tailwind translate classes. */}
          <div className="absolute inset-0 z-10 grid place-items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.5 }}
              className="grid h-14 w-14 place-items-center rounded-full bg-rose-500 shadow-glow ring-4 ring-[#2B1D22]"
            >
              <Heart className="h-6 w-6" fill="currentColor" strokeWidth={0} aria-hidden />
            </motion.div>
          </div>
          <div className="-ml-5">
            <Avatar src={profile.photoUrl} name={profile.name} rotate={7} />
          </div>
        </div>

        <motion.h2
          id="match-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-10 font-display text-5xl font-semibold italic tracking-tight"
        >
          It&apos;s a match!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-3 max-w-xs text-base leading-relaxed text-white/75"
        >
          You and <span className="font-medium text-white">{profile.name}</span> liked each other. Some
          things are worth the wait.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-9 flex w-full flex-col gap-3"
        >
          <Button size="lg" onClick={onViewMatches} autoFocus>
            View matches
          </Button>
          <Button size="lg" variant="onDark" onClick={onContinue}>
            Keep discovering
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
