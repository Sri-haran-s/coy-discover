// Shared types: the exact JSON shapes exchanged between the API and the UI.

export type SwipeAction = "like" | "pass";

export type Presence = "online" | "recent" | "offline";

/** A profile as exposed to the client. Deliberately contains NO like information. */
export interface PublicProfile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  city: string;
  college: string | null;
  interests: string[];
  presence: Presence;
}

export interface DemoUser {
  id: string;
  name: string;
  photoUrl: string;
}

export interface MatchItem {
  id: string;
  matchedAt: string; // ISO date
  profile: PublicProfile;
}

export interface FeedResponse {
  profiles: PublicProfile[];
  total: number;
}

export interface SwipeResponse {
  action: SwipeAction;
  matched: boolean;
  match: MatchItem | null;
}

export interface MatchesResponse {
  user: DemoUser;
  matches: MatchItem[];
}

export interface ResetResponse {
  swipesCleared: number;
  matchesCleared: number;
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}
