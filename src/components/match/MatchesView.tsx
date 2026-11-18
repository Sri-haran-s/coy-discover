"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CloudOff, Compass, HeartHandshake } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import type { MatchItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonStyles } from "@/components/ui/button-styles";
import { MatchCard } from "./MatchCard";

type Status = "loading" | "ready" | "error";

function EmptyMatches() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      {/* Two overlapping soft circles: a quiet "almost" illustration */}
      <div aria-hidden className="relative mb-8 h-28 w-44">
        <div className="absolute left-4 top-2 h-24 w-24 rounded-full bg-gradient-to-br from-blush to-rose-100" />
        <div className="absolute right-4 top-2 h-24 w-24 rounded-full bg-gradient-to-br from-cream-300 to-blush/80 mix-blend-multiply" />
        <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-rose-500 shadow-soft">
          <HeartHandshake className="h-5 w-5" />
        </div>
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight">No matches yet</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
        When you and someone else like each other, they'll appear here. Until then, keep exploring —
        the right person is usually a swipe or two away.
      </p>
      <Link href="/discover" className={buttonStyles({ size: "lg", className: "mt-8" })}>
        <Compass className="h-4 w-4" aria-hidden />
        Back to Discover
      </Link>
    </div>
  );
}

function MatchesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" role="status" aria-label="Loading matches">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/6] rounded-3xl" />
      ))}
    </div>
  );
}

export function MatchesView() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await api.getMatches();
      setMatches(data.matches);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8 pt-2">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">Your matches</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          {status === "ready" && matches.length > 0
            ? `${matches.length} ${matches.length === 1 ? "person" : "people"} who liked you back.`
            : "People who liked you back."}
        </p>
      </div>

      {status === "loading" && <MatchesSkeleton />}

      {status === "error" && (
        <div className="mx-auto flex max-w-sm flex-col items-center py-16 text-center">
          <CloudOff className="mb-4 h-8 w-8 text-rose-500" aria-hidden />
          <p className="text-ink-muted">{error}</p>
          <Button className="mt-6" onClick={load}>
            Try again
          </Button>
        </div>
      )}

      {status === "ready" && matches.length === 0 && <EmptyMatches />}

      {status === "ready" && matches.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {matches.map((match) => (
            <motion.div
              key={match.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <MatchCard match={match} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
