import { json, route } from "@/server/http";
import { requireDemoUser } from "@/server/demo-user";

export const dynamic = "force-dynamic";

/** GET /api/me — the demo user (used for the "It's a match!" screen). */
export const GET = route(async () => {
  return json({ user: await requireDemoUser() });
});
