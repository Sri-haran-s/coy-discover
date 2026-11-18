import type { MatchItem } from "@/types";
import { prisma } from "../db";
import { PUBLIC_PROFILE_SELECT, toMatchItem } from "../serializers";

/** Mutual matches only, newest first. One-sided likes are never in this table. */
export async function getMatches(userId: string): Promise<MatchItem[]> {
  const rows = await prisma.match.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      profile: { select: PUBLIC_PROFILE_SELECT },
    },
  });
  return rows.map(toMatchItem);
}
