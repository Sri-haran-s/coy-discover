// End-to-end API checks for the matching rules and the privacy guarantees.
//
// Usage (with the app running and the database seeded):
//   npm run test:api
//   BASE_URL=http://localhost:3001 npm run test:api
//
// NOTE: this test resets the demo user's swipes and matches (via POST /api/demo/reset).

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const PUBLIC_PROFILE_KEYS = [
  "age", "bio", "city", "college", "id", "interests", "name", "photoUrl", "presence",
];

let failures = 0;

function check(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function call(method, path, body) {
  const init = { method, headers: {} };
  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, init);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

const swipe = (profileId, action) => call("POST", "/api/swipe", { profileId, action });

async function main() {
  console.log(`Testing ${BASE_URL}\n`);

  console.log("Reset & feed");
  const reset = await call("POST", "/api/demo/reset");
  check("POST /api/demo/reset returns 200", reset.status === 200);

  const feed = await call("GET", "/api/feed");
  check("GET /api/feed returns 200", feed.status === 200);
  const profiles = feed.data?.profiles ?? [];
  check("at least 30 profiles are available", profiles.length >= 30, `got ${profiles.length}`);
  check("total matches the number of profiles returned", feed.data?.total === profiles.length);
  check(
    "profiles expose only public fields (no like information)",
    profiles.every((p) => Object.keys(p).sort().join() === PUBLIC_PROFILE_KEYS.join()),
  );
  check(
    "feed JSON mentions no incoming-like data",
    !/like/i.test(JSON.stringify(feed.data)),
  );
  check("profile ids are unique", new Set(profiles.map((p) => p.id)).size === profiles.length);
  check("photos are not all identical", new Set(profiles.map((p) => p.photoUrl)).size > 20);

  console.log("\nValidation");
  const badJson = await call("POST", "/api/swipe", "{not json");
  check("malformed JSON -> 400", badJson.status === 400 && badJson.data?.error?.code === "INVALID_JSON");
  const noId = await call("POST", "/api/swipe", { action: "like" });
  check("missing profileId -> 400", noId.status === 400 && noId.data?.error?.code === "INVALID_PROFILE_ID");
  const badAction = await swipe(profiles[0].id, "superlike");
  check("unknown action -> 400", badAction.status === 400 && badAction.data?.error?.code === "INVALID_ACTION");
  const notFound = await swipe("does-not-exist", "like");
  check("unknown profile -> 404", notFound.status === 404);
  const badLimit = await call("GET", "/api/feed?limit=abc");
  check("invalid ?limit -> 400", badLimit.status === 400);

  console.log("\nPass & duplicate protection");
  const first = profiles[0];
  const passed = await swipe(first.id, "pass");
  check("pass -> 201, no match", passed.status === 201 && passed.data?.matched === false);
  const duplicate = await swipe(first.id, "like");
  check("second swipe on same profile -> 409", duplicate.status === 409);
  const afterPass = await call("GET", "/api/feed");
  check("passed profile never returns to the feed", !afterPass.data.profiles.some((p) => p.id === first.id));

  console.log("\nLiking everyone else");
  const matchedIds = [];
  for (const profile of profiles.slice(1)) {
    const res = await swipe(profile.id, "like");
    if (res.status !== 201) {
      check(`like ${profile.name}`, false, `status ${res.status}`);
      continue;
    }
    if (res.data.matched) {
      matchedIds.push(profile.id);
      check(
        `match payload for ${profile.name} is well-formed`,
        res.data.match?.profile?.id === profile.id && typeof res.data.match?.id === "string",
      );
    } else {
      check(`one-sided like on ${profile.name} reveals nothing`, res.data.match === null);
    }
  }
  check("some mutual matches were created", matchedIds.length >= 1, `got ${matchedIds.length}`);
  check("not every like became a match (one-sided likes stay one-sided)", matchedIds.length < profiles.length - 1);

  console.log("\nMatches");
  const matches = await call("GET", "/api/matches");
  check("GET /api/matches returns 200", matches.status === 200);
  const listed = matches.data?.matches ?? [];
  check("matches list equals the matches reported by /api/swipe", listed.length === matchedIds.length);
  check(
    "only mutually-liked profiles are listed",
    listed.every((m) => matchedIds.includes(m.profile.id)),
  );
  check("no duplicate matches", new Set(listed.map((m) => m.profile.id)).size === listed.length);
  check("the passed profile is not a match", !listed.some((m) => m.profile.id === first.id));
  check("response includes the demo user", typeof matches.data?.user?.id === "string");

  const emptyFeed = await call("GET", "/api/feed");
  check("feed is empty once everyone has been swiped", emptyFeed.data?.profiles.length === 0 && emptyFeed.data?.total === 0);

  console.log("\nReset keeps incoming likes, so matching still works afterwards");
  const reset2 = await call("POST", "/api/demo/reset");
  check(
    "reset clears swipes and matches",
    reset2.status === 200 &&
      reset2.data.swipesCleared === profiles.length &&
      reset2.data.matchesCleared === matchedIds.length,
  );
  const afterReset = await call("GET", "/api/feed");
  check("full feed is restored", afterReset.data?.total === profiles.length);
  const matchesAfterReset = await call("GET", "/api/matches");
  check("matches are cleared", matchesAfterReset.data?.matches.length === 0);

  // Passing on everyone must never create a match, even for profiles that liked us.
  for (const profile of profiles) await swipe(profile.id, "pass");
  const passAll = await call("GET", "/api/matches");
  check("passing on everyone creates zero matches", passAll.data?.matches.length === 0);

  await call("POST", "/api/demo/reset");

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("\nCould not run the tests — is the app running and seeded?\n", err.message);
  process.exit(1);
});
