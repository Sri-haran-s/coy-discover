# Coy Discover

A mobile-first, swipe-based discovery app with **privacy-first mutual matching**. Browse profiles, like or pass, and get a match only when *both* people like each other. Nobody ever learns who liked them first.

Built as an SDE Intern assignment to demonstrate frontend craft, backend logic, database design and privacy awareness.

---

## 1. Features

- **Discover** — one profile card at a time with a large portrait, name, age, city/college, bio and interest tags
- **Swipe interactions** — drag right to like, left to pass (mouse and touch), Like / Pass buttons, `→` / `←` keyboard shortcuts, live LIKE / PASS stamps, rotation while dragging, smooth exit animations
- **Real mutual matching** — computed on the server inside a database transaction; matches are created exactly once
- **"It's a match!" celebration** — full-screen overlay with both photos, animated rings and sparks
- **Matches** — responsive grid of mutual matches with a thoughtful empty state
- **Privacy by design** — incoming likes are stored but never returned by any endpoint
- **Persistence** — swipes and matches live in SQLite and survive refreshes and restarts
- **Polish** — loading skeletons, empty/error states, toasts, image fallbacks, disabled states during requests, page transitions, safe-area aware mobile layout
- **Demo reset** — clear your swipes and matches (UI button, API or CLI) while keeping seeded data
- **Accessible controls** — labelled buttons, dialog semantics, focus rings, keyboard support

## 2. Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS 3 (custom design tokens) |
| Motion / icons | Framer Motion, Lucide React |
| Backend | Next.js Route Handlers on Node.js |
| Database | SQLite via Prisma ORM 5 |

## 3. Screenshots

Add screenshots to [`docs/screenshots/`](docs/screenshots) and embed them here:

```md
![Discover on mobile](docs/screenshots/discover-mobile.png)
![Discover on desktop](docs/screenshots/discover-desktop.png)
![It's a match](docs/screenshots/match-modal.png)
![Matches](docs/screenshots/matches.png)
```

Tip: in Chrome DevTools use *Toggle device toolbar* (Ctrl/Cmd+Shift+M) for the mobile shots.

## 4. Project structure

```
coy-discover/
├── prisma/
│   ├── schema.prisma          # User, Profile, Swipe, ProfileLike, Match
│   └── seed.ts                # 1 demo user, 32 profiles, 8 private incoming likes
├── scripts/
│   ├── reset-demo.ts          # CLI demo reset
│   └── api-smoke-test.mjs     # end-to-end API + privacy checks
├── src/
│   ├── app/
│   │   ├── layout.tsx         # fonts, toast provider, app shell
│   │   ├── template.tsx       # page transition
│   │   ├── page.tsx           # Home
│   │   ├── discover/page.tsx
│   │   ├── matches/page.tsx
│   │   └── api/
│   │       ├── feed/route.ts          # GET  /api/feed
│   │       ├── swipe/route.ts         # POST /api/swipe
│   │       ├── matches/route.ts       # GET  /api/matches
│   │       ├── me/route.ts            # GET  /api/me
│   │       └── demo/reset/route.ts    # POST /api/demo/reset
│   ├── components/
│   │   ├── layout/            # AppShell, DesktopNav, BottomNav
│   │   ├── ui/                # Button, Logo, Toast, Skeleton, SmartImage, ResetDemoButton
│   │   ├── profile/           # ProfileCard, InterestTags, PresenceBadge
│   │   ├── swipe/             # DiscoverView, SwipeDeck, SwipeCard, ActionButtons, ...
│   │   └── match/             # MatchModal, MatchesView, MatchCard
│   ├── hooks/                 # useDeck, useSwipeKeys, useDemoUser
│   ├── lib/                   # api-client, utils, avatar fallback
│   ├── server/                # db, errors, http helpers, validation, serializers
│   │   └── services/          # feed, swipes, matches, demo (all business logic)
│   └── types/                 # shared API types
├── .env.example
├── package.json
└── README.md
```

## 5. Installation

Requires **Node.js 18.18+** and npm.

```bash
cd coy-discover
cp .env.example .env     # on Windows PowerShell: copy .env.example .env
npm install              # also runs `prisma generate`
```

## 6. Environment setup

`.env` (copied from `.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `file:./dev.db` | SQLite file, relative to `prisma/` |
| `DEMO_USER_ID` | `demo-user` | Id of the single "logged-in" user |
| `ALLOW_DEMO_RESET` | `true` | Set to `false` to disable `POST /api/demo/reset` |

## 7. Database setup & seeding

```bash
npm run db:setup     # creates prisma/dev.db and seeds it
```

This runs `prisma db push` followed by `prisma db seed`. The seed creates:

- 1 demo user
- 32 profiles with varied names, cities, bios and interests
- 8 **private** incoming likes (profiles that already liked the demo user)

Other database commands:

| Command | What it does |
| --- | --- |
| `npm run db:seed` | Rebuild all seed data (also clears swipes/matches) |
| `npm run db:reset` | Drop and recreate the database, then seed |
| `npm run demo:reset` | Clear only the demo user's swipes and matches |

## 8. Run locally

```bash
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

Verify the backend (app must be running and seeded):

```bash
npm run test:api                          # uses http://localhost:3000
BASE_URL=http://localhost:3001 npm run test:api
```

The test resets the demo user's swipes/matches, then checks validation, duplicate protection, matching rules, privacy and reset behaviour.

### Trying the matching demo

1. Open `/discover` and like profiles. A few of them (e.g. **Ananya Rao**, the 3rd card) have already liked you, so liking them triggers **It's a match!**.
2. Open `/matches` to see them. Refresh — everything persists.
3. Use **Reset demo** (Discover side panel, Home, or the empty-feed state) to replay.

## 9. API documentation

All responses are JSON with `Cache-Control: no-store`. Errors share one shape:

```json
{ "error": { "code": "INVALID_ACTION", "message": "`action` must be either \"like\" or \"pass\"." } }
```

### `GET /api/feed?limit=50`

Profiles the demo user has **not** swiped on yet (liked and passed profiles are excluded). `limit` is optional (1–100).

```json
{
  "profiles": [
    { "id": "…", "name": "Meera Iyer", "age": 24, "photoUrl": "https://…", "bio": "…",
      "city": "Coimbatore", "college": "PSG Tech", "interests": ["Design", "…"], "presence": "online" }
  ],
  "total": 32
}
```

The payload never says whether a profile has liked the user.

### `POST /api/swipe`

```json
{ "profileId": "<profile id>", "action": "like" }
```

| Status | Meaning |
| --- | --- |
| `201` | Swipe stored. Body: `{ "action", "matched": boolean, "match": null \| { "id", "matchedAt", "profile" } }` |
| `400` | `INVALID_JSON`, `INVALID_BODY`, `INVALID_PROFILE_ID` or `INVALID_ACTION` |
| `404` | `PROFILE_NOT_FOUND` |
| `409` | `ALREADY_SWIPED` — duplicate swipe |

`match` is only non-null when the like is mutual.

### `GET /api/matches`

Mutual matches only, newest first:

```json
{ "user": { "id": "demo-user", "name": "Demo User", "photoUrl": "…" },
  "matches": [ { "id": "…", "matchedAt": "2026-…", "profile": { "…": "…" } } ] }
```

### `GET /api/me`

The demo user (`{ "user": { id, name, photoUrl } }`). Used for the match celebration.

### `POST /api/demo/reset`

Deletes the demo user's swipes and matches; seeded profiles and incoming likes are kept. Returns `{ "swipesCleared": n, "matchesCleared": n }`. Responds `403 RESET_DISABLED` if `ALLOW_DEMO_RESET=false`.

## 10. Matching logic

`src/server/services/swipes.ts` — `recordSwipe` runs in **one transaction**:

1. Verify the profile exists (`404` otherwise).
2. Insert the `Swipe`. A unique index on `(userId, profileId)` makes a second swipe fail with Prisma `P2002`, which becomes a `409`. Duplicates are prevented by the database, not just by code.
3. If the action is `pass` → done, no match.
4. If it is `like`, look up a `ProfileLike` from that profile to the user.
   - None → one-sided like; nothing is created or revealed.
   - Exists → `upsert` a `Match`. The unique index on `(userId, profileId)` guarantees it is created only once.

The client sends each swipe optimistically (the card leaves immediately) and restores it if the request fails. A ref-based lock blocks a second swipe until the first request finishes.

## 11. Privacy approach

- **Separate tables.** The user's own decisions (`Swipe`) and other people's likes toward the user (`ProfileLike`) are different tables. Only `Match` is ever shown.
- **Whitelisted serialisation.** Every profile sent to the client goes through a single Prisma `select` (`PUBLIC_PROFILE_SELECT`), so relations such as `likesGiven` cannot leak by accident.
- **No side channels.** The feed query never reads `ProfileLike`; feed order is a fixed `position`, independent of likes. A one-sided like produces an identical response to "no like".
- **No badges, counts or lists** of incoming likes anywhere in the UI.
- **Verified** by `npm run test:api` (feed has exactly the public fields; one-sided likes reveal nothing; passing never matches).

## 12. Known limitations

- Single demo user; there is no authentication.
- Profile photos are hot-linked from `randomuser.me`. Offline or blocked, the app shows a generated initials portrait instead.
- Feed order is fixed rather than ranked or randomised.
- No chat (out of scope for this assignment).
- Interests are stored as a JSON string because SQLite has no array type.

## 13. Future improvements

- Real authentication and multiple users, so incoming likes come from real people
- Chat between matches, with read receipts and safety controls (block / report)
- Preferences and filters (age, distance) and a ranked, paginated feed
- Undo last swipe, and a daily like budget
- Image uploads with moderation, and multiple photos per profile
- Postgres in production, with Prisma migrations instead of `db push`
- Automated component and E2E tests (Vitest, Playwright) and CI

## 14. Scripts reference

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:setup` | Create schema and seed |
| `npm run db:seed` | Re-seed |
| `npm run db:reset` | Recreate DB and seed |
| `npm run demo:reset` | Clear demo swipes and matches |
| `npm run test:api` | End-to-end API and privacy checks |
