"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import type { MatchItem, PublicProfile, SwipeAction } from "@/types";
import { useToast } from "@/components/ui/Toast";

type DeckStatus = "loading" | "ready" | "error";

/**
 * State machine for the Discover feed: loading, swiping (with duplicate-swipe
 * protection), match detection and demo reset.
 */
export function useDeck() {
  const toast = useToast();

  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [status, setStatus] = useState<DeckStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [exitDirection, setExitDirection] = useState<1 | -1>(1);
  const [busy, setBusy] = useState(false);
  const [match, setMatch] = useState<MatchItem | null>(null);

  // A ref (not state) so two quick inputs in the same tick can't both pass the guard.
  const swipingRef = useRef(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const feed = await api.getFeed();
      setProfiles(feed.profiles);
      setInitialTotal(feed.total);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const swipe = useCallback(
    async (action: SwipeAction) => {
      const current = profiles[0];
      if (!current || swipingRef.current || match) return;

      swipingRef.current = true;
      setBusy(true);

      // Optimistic: the card leaves immediately; we restore it if the request fails.
      setExitDirection(action === "like" ? 1 : -1);
      setProfiles((list) => list.slice(1));

      try {
        const result = await api.swipe(current.id, action);
        if (result.match) setMatch(result.match);
      } catch (err) {
        // 409 = the server already has a swipe for this profile, so keep it removed.
        if (!(err instanceof ApiError && err.status === 409)) {
          setProfiles((list) => [current, ...list]);
          toast.error(err instanceof ApiError ? err.message : "Couldn't save your swipe.");
        }
      } finally {
        swipingRef.current = false;
        setBusy(false);
      }
    },
    [profiles, match, toast],
  );

  const dismissMatch = useCallback(() => setMatch(null), []);

  return {
    profiles,
    reviewed: Math.max(0, initialTotal - profiles.length),
    initialTotal,
    status,
    errorMessage,
    exitDirection,
    busy,
    match,
    swipe,
    dismissMatch,
    reload: load,
  };
}
