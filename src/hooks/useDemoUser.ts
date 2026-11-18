"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import type { DemoUser } from "@/types";

/** Loads the demo user once. Failure is silent: the UI falls back to an initials avatar. */
export function useDemoUser(): DemoUser | null {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
