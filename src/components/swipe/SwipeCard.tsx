"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { PublicProfile, SwipeAction } from "@/types";
import { ProfileCard } from "@/components/profile/ProfileCard";

/** Distance (px) a drag must travel, counting a little velocity, to commit a swipe. */
const SWIPE_THRESHOLD = 110;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// `custom` is the exit direction: 1 = right (like), -1 = left (pass).
// Animating x also drives the rotation and the LIKE/PASS stamps below.
const variants = {
  front: { scale: 1, y: 0, opacity: 1 },
  back: { scale: 0.95, y: 16, opacity: 1 },
  exit: (direction: number) => ({
    x: direction * 560,
    opacity: 0,
    transition: {
      x: { duration: 0.42, ease: EASE_OUT },
      opacity: { duration: 0.22, delay: 0.18 },
    },
  }),
};

interface SwipeCardProps {
  profile: PublicProfile;
  isTop: boolean;
  /** True while a swipe request is in flight: blocks new drags (no double swipes). */
  locked: boolean;
  onSwipe: (action: SwipeAction) => void;
}

export function SwipeCard({ profile, isTop, locked, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-11, 0, 11]);
  const likeOpacity = useTransform(x, [30, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -30], [1, 0]);
  const likeGlow = useTransform(x, [0, 180], [0, 0.45]);
  const passGlow = useTransform(x, [-180, 0], [0.4, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (locked) return;
    // A fast flick counts: add a fraction of the release velocity to the offset.
    const power = info.offset.x + info.velocity.x * 0.2;
    if (power > SWIPE_THRESHOLD) onSwipe("like");
    else if (power < -SWIPE_THRESHOLD) onSwipe("pass");
  }

  return (
    <motion.div
      className="absolute inset-0 touch-pan-y select-none"
      style={isTop ? { x, rotate, zIndex: 2 } : { zIndex: 1 }}
      variants={variants}
      initial={isTop ? false : { opacity: 0, scale: 0.9, y: 28 }}
      animate={isTop ? "front" : "back"}
      exit="exit"
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      drag={isTop && !locked ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.85}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      aria-hidden={!isTop}
    >
      <div className={isTop ? "h-full w-full cursor-grab" : "h-full w-full"}>
        <ProfileCard profile={profile} priority={isTop} />
      </div>

      {isTop && (
        <>
          {/* Colour wash that grows as the card is dragged toward a decision */}
          <motion.div
            aria-hidden
            style={{ opacity: likeGlow }}
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-rose-400/60 to-transparent"
          />
          <motion.div
            aria-hidden
            style={{ opacity: passGlow }}
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-bl from-ink/60 to-transparent"
          />

          <motion.span
            aria-hidden
            style={{ opacity: likeOpacity }}
            className="pointer-events-none absolute left-6 top-8 -rotate-12 rounded-xl border-2 border-white bg-rose-500/90 px-4 py-1.5 text-lg font-bold tracking-[0.25em] text-white shadow-glow"
          >
            LIKE
          </motion.span>
          <motion.span
            aria-hidden
            style={{ opacity: passOpacity }}
            className="pointer-events-none absolute right-6 top-8 rotate-12 rounded-xl border-2 border-white bg-ink/85 px-4 py-1.5 text-lg font-bold tracking-[0.25em] text-white"
          >
            PASS
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
