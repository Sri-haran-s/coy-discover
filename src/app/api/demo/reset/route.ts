import { json, route } from "@/server/http";
import { requireDemoUser } from "@/server/demo-user";
import { resetDemo } from "@/server/services/demo";

export const dynamic = "force-dynamic";

/** POST /api/demo/reset — clears the demo user's swipes and matches. */
export const POST = route(async () => {
  const user = await requireDemoUser();
  return json(await resetDemo(user.id));
});
