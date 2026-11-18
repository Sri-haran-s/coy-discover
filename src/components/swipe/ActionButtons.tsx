"use client";

import { Heart, X } from "lucide-react";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  disabled: boolean;
}

/** Large, touch-friendly Pass / Like controls under the card. */
export function ActionButtons({ onPass, onLike, disabled }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6 pt-5 sm:gap-8">
      <motion.button
        type="button"
        onClick={onPass}
        disabled={disabled}
        whileTap={{ scale: 0.88 }}
        whileHover={{ y: -2 }}
        aria-label="Pass (left arrow)"
        title="Pass (←)"
        className="grid h-16 w-16 place-items-center rounded-full bg-white text-ink-soft shadow-lift ring-1 ring-ink/10 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-50"
      >
        <X className="h-7 w-7" strokeWidth={2.4} aria-hidden />
      </motion.button>

      <motion.button
        type="button"
        onClick={onLike}
        disabled={disabled}
        whileTap={{ scale: 0.88 }}
        whileHover={{ y: -2 }}
        aria-label="Like (right arrow)"
        title="Like (→)"
        className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-glow transition-[filter] hover:brightness-105 disabled:pointer-events-none disabled:opacity-50"
      >
        <Heart className="h-8 w-8" fill="currentColor" strokeWidth={0} aria-hidden />
      </motion.button>
    </div>
  );
}
