import { json, route } from "@/server/http";
import { requireDemoUser } from "@/server/demo-user";
import { getFeed } from "@/server/services/feed";
import { parseLimit } from "@/server/validation";

export const dynamic = "force-dynamic";

/** GET /api/feed?limit=50 — profiles the demo user has not swiped on yet. */
export const GET = route(async (request: Request) => {
  const limit = parseLimit(new URL(request.url).searchParams.get("limit"));
  const user = await requireDemoUser();
  return json(await getFeed(user.id, limit));
});
