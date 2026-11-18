"use client";

import { useEffect } from "react";
import type { SwipeAction } from "@/types";

/** Right arrow = like, left arrow = pass. Ignored while typing or with modifier keys. */
export function useSwipeKeys(onSwipe: (action: SwipeAction) => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onSwipe("like");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onSwipe("pass");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSwipe]);
}
