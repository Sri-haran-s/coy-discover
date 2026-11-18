import { AppError } from "@/server/errors";
import { json, route } from "@/server/http";
import { requireDemoUser } from "@/server/demo-user";
import { recordSwipe } from "@/server/services/swipes";
import { parseSwipeBody } from "@/server/validation";
import type { SwipeResponse } from "@/types";

export const dynamic = "force-dynamic";

/** POST /api/swipe  { profileId, action: "like" | "pass" } */
export const POST = route(async (request: Request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AppError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }

  const { profileId, action } = parseSwipeBody(body);
  const user = await requireDemoUser();
  const result = await recordSwipe(user.id, profileId, action);

  const response: SwipeResponse = {
    action: result.action,
    matched: result.match !== null,
    match: result.match,
  };
  return json(response, 201);
});
