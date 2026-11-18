import type { DemoUser } from "@/types";
import { prisma } from "./db";
import { AppError } from "./errors";

/** The one "logged-in" user. There is no authentication in this prototype. */
export const DEMO_USER_ID = process.env.DEMO_USER_ID ?? "demo-user";

export async function requireDemoUser(): Promise<DemoUser> {
  const user = await prisma.user.findUnique({
    where: { id: DEMO_USER_ID },
    select: { id: true, name: true, photoUrl: true },
  });
  if (!user) {
    throw new AppError(
      500,
      "DEMO_USER_MISSING",
      "Demo user not found. Run `npm run db:setup` to create and seed the database.",
    );
  }
  return user;
}
