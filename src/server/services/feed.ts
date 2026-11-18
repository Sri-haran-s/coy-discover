import type { FeedResponse } from "@/types";
import { prisma } from "../db";
import { PUBLIC_PROFILE_SELECT, toPublicProfile } from "../serializers";

/**
 * Profiles the user has not swiped on yet.
 *
 * `swipes: { none: { userId } }` excludes every liked AND passed profile.
 * Nothing in this query reads ProfileLike, so the feed (and its order, which is
 * a fixed `position`) carries no information about who already liked the user.
 */
export async function getFeed(userId: string, limit: number): Promise<FeedResponse> {
  const where = { swipes: { none: { userId } } };

  const [rows, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      select: PUBLIC_PROFILE_SELECT,
      orderBy: [{ position: "asc" }, { id: "asc" }],
      take: limit,
    }),
    prisma.profile.count({ where }),
  ]);

  return { profiles: rows.map(toPublicProfile), total };
}
