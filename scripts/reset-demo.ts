// Usage: npm run demo:reset
// Clears the demo user's swipes and matches; seeded profiles and incoming likes stay.
import { prisma } from "../src/server/db";
import { DEMO_USER_ID } from "../src/server/demo-user";
import { resetDemo } from "../src/server/services/demo";

async function main() {
  const result = await resetDemo(DEMO_USER_ID);
  console.log(
    `Demo reset: cleared ${result.swipesCleared} swipes and ${result.matchesCleared} matches.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
