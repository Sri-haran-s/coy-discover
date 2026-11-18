import type { SwipeAction } from "@/types";
import { AppError } from "./errors";

const ACTIONS: readonly SwipeAction[] = ["like", "pass"];
const MAX_ID_LENGTH = 64;

export interface SwipeInput {
  profileId: string;
  action: SwipeAction;
}

/** Validates the untrusted JSON body of POST /api/swipe. */
export function parseSwipeBody(body: unknown): SwipeInput {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new AppError(400, "INVALID_BODY", "Request body must be a JSON object.");
  }
  const { profileId, action } = body as Record<string, unknown>;

  if (typeof profileId !== "string" || profileId.trim() === "" || profileId.length > MAX_ID_LENGTH) {
    throw new AppError(400, "INVALID_PROFILE_ID", "`profileId` must be a non-empty string.");
  }
  if (typeof action !== "string" || !ACTIONS.includes(action as SwipeAction)) {
    throw new AppError(400, "INVALID_ACTION", '`action` must be either "like" or "pass".');
  }
  return { profileId: profileId.trim(), action: action as SwipeAction };
}

/** Parses an optional `?limit=` query value into a safe integer. */
export function parseLimit(raw: string | null, fallback = 50, max = 100): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    throw new AppError(400, "INVALID_LIMIT", "`limit` must be a positive integer.");
  }
  return Math.min(n, max);
}
