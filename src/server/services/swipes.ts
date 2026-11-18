import { Prisma } from "@prisma/client";
import type { MatchItem, SwipeAction } from "@/types";
import { prisma } from "../db";
import { AppError } from "../errors";
import { PUBLIC_PROFILE_SELECT, toMatchItem } from "../serializers";

export interface SwipeResult {
  action: SwipeAction;
  match: MatchItem | null;
}

/**
 * Records a swipe and, for a "like", creates a match if (and only if) the
 * profile has already liked the user.
 *
 * Everything runs in one transaction so a swipe and its match are atomic.
 * Duplicate protection is enforced by the database itself: Swipe has a
 * unique (userId, profileId) index, so a second swipe on the same profile
 * fails with Prisma error P2002 which we translate into a 409.
 */
export async function recordSwipe(
  userId: string,
  profileId: string,
  action: SwipeAction,
): Promise<SwipeResult> {
  const exists = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { id: true },
  });
  if (!exists) {
    throw new AppError(404, "PROFILE_NOT_FOUND", "That profile does not exist.");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.swipe.create({ data: { userId, profileId, action } });

      if (action !== "like") return { action, match: null };

      // Has this profile already liked the user? (Private: never sent to the client.)
      const incoming = await tx.profileLike.findUnique({
        where: { profileId_userId: { profileId, userId } },
        select: { id: true },
      });
      if (!incoming) return { action, match: null };

      // upsert + unique(userId, profileId) => a match is created only once.
      const match = await tx.match.upsert({
        where: { userId_profileId: { userId, profileId } },
        create: { userId, profileId },
        update: {},
        select: {
          id: true,
          createdAt: true,
          profile: { select: PUBLIC_PROFILE_SELECT },
        },
      });
      return { action, match: toMatchItem(match) };
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new AppError(409, "ALREADY_SWIPED", "You have already swiped on this profile.");
    }
    throw err;
  }
}
