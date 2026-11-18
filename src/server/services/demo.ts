import type { ResetResponse } from "@/types";
import { prisma } from "../db";
import { AppError } from "../errors";

/**
 * Clears the demo user's swipes and matches so the demo can be replayed.
 * Seeded profiles and their (private) incoming likes are left untouched.
 */
export async function resetDemo(userId: string): Promise<ResetResponse> {
  if (process.env.ALLOW_DEMO_RESET === "false") {
    throw new AppError(403, "RESET_DISABLED", "Demo reset is disabled in this environment.");
  }

  const [matches, swipes] = await prisma.$transaction([
    prisma.match.deleteMany({ where: { userId } }),
    prisma.swipe.deleteMany({ where: { userId } }),
  ]);
  return { swipesCleared: swipes.count, matchesCleared: matches.count };
}
