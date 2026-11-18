import type { Prisma } from "@prisma/client";
import type { MatchItem, Presence, PublicProfile } from "@/types";

/**
 * The ONLY fields ever selected for profiles sent to the client.
 * Using `select` (rather than returning whole rows) means relations such as
 * ProfileLike can never leak into a response by accident.
 */
export const PUBLIC_PROFILE_SELECT = {
  id: true,
  name: true,
  age: true,
  photoUrl: true,
  bio: true,
  city: true,
  college: true,
  interests: true,
  presence: true,
} satisfies Prisma.ProfileSelect;

type ProfileRow = Prisma.ProfileGetPayload<{ select: typeof PUBLIC_PROFILE_SELECT }>;

const PRESENCE_VALUES: Presence[] = ["online", "recent", "offline"];

function parseInterests(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function toPublicProfile(row: ProfileRow): PublicProfile {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    photoUrl: row.photoUrl,
    bio: row.bio,
    city: row.city,
    college: row.college,
    interests: parseInterests(row.interests),
    presence: PRESENCE_VALUES.includes(row.presence as Presence)
      ? (row.presence as Presence)
      : "offline",
  };
}

export function toMatchItem(row: {
  id: string;
  createdAt: Date;
  profile: ProfileRow;
}): MatchItem {
  return {
    id: row.id,
    matchedAt: row.createdAt.toISOString(),
    profile: toPublicProfile(row.profile),
  };
}
