import { json, route } from "@/server/http";
import { requireDemoUser } from "@/server/demo-user";
import { getMatches } from "@/server/services/matches";
import type { MatchesResponse } from "@/types";

export const dynamic = "force-dynamic";

/** GET /api/matches — mutual matches only (both user and profile details). */
export const GET = route(async () => {
  const user = await requireDemoUser();
  const matches = await getMatches(user.id);
  const response: MatchesResponse = { user, matches };
  return json(response);
});
