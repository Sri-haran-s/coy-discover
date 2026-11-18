"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { Button } from "./Button";
import { useToast } from "./Toast";
import type { ButtonVariant } from "./button-styles";

interface ResetDemoButtonProps {
  variant?: ButtonVariant;
  /** Called after a successful reset (e.g. to reload the feed). */
  onReset?: () => void;
}

/**
 * Two-step button: the first click asks for confirmation, the second performs
 * the reset. Clears the demo user's swipes + matches only.
 */
export function ResetDemoButton({ variant = "secondary", onReset }: ResetDemoButtonProps) {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  // Drop the confirmation state if the user doesn't follow through.
  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  async function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setBusy(true);
    try {
      const result = await api.resetDemo();
      toast.success(
        `Demo reset — ${result.swipesCleared} swipes and ${result.matchesCleared} matches cleared.`,
      );
      onReset?.();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't reset the demo.");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <Button variant={variant} loading={busy} onClick={handleClick}>
      {!busy && <RotateCcw className="h-4 w-4" aria-hidden />}
      {confirming ? "Tap again to confirm" : "Reset demo"}
    </Button>
  );
}
