---
title: "Secure Networking Tracker"
description: "A private contact tracker where ownership is enforced by Postgres itself, not by the API layer."
summary: "A networking tracker for Berkeley contacts where one user's list is unreachable to another even if the API layer were bypassed entirely — because the boundary lives in Postgres, not in application code."
role: "Sole designer and engineer"
period: "Sep 2026"
depth: "project"
org: "UC Berkeley"
badges: ["Full-stack", "Security design"]
live: true
tags: ["eng", "shipped"]
metrics:
  - n: "3"
    l: "independent ownership mechanisms"
  - n: "28"
    l: "validation tests"
  - n: "404"
    l: "returned, not 403"
  - n: "0"
    l: "secrets in the client bundle"
links:
  live: "https://secure-networking-tracker-phi.vercel.app"
  code: "https://github.com/easonhanyc/secure-networking-tracker"
featured: false
order: 5
---

**Role:** Sole designer and engineer · **Stack:** Next.js 16 · Neon Postgres · Better Auth · Vercel · **Status:** [Live](https://secure-networking-tracker-phi.vercel.app)

> **The 30-second version.** A private tracker for the people I meet at Berkeley — where we met, what they do, how much I want to prioritise the relationship. The interesting part is not the CRUD. It is that every contact belongs to exactly one account and that ownership is enforced by Postgres through Row Level Security, so one user's list stays unreachable to another *even if the API layer were bypassed entirely*.

---

## 1. The decision that shaped everything else

Neon's Data API is safe to call straight from the browser, because RLS protects the rows. This project could have done that, and it would have been less code.

I routed every request through my own server instead — and the reasoning is the part worth reading, because it is easy to get backwards.

**Going through a backend is not what makes the data private.** RLS is. The server adds a second, independent layer: input is validated by trusted code before it reaches the database, error text is normalised so raw Postgres strings never reach a client, and the query shape stays under my control.

> The API layer is defence in depth, not a substitute for the real boundary. Naming which one is load-bearing is the whole point — a team that believes its API checks *are* the security model has no security model.

## 2. Where the boundary actually is

Three independent mechanisms enforce one rule: a row belongs to the user whose token created it.

1. **The database assigns ownership.** `user_id` is `NOT NULL DEFAULT auth.user_id()`. The API never sends it, and the validation schema strips it if a client tries — so the value always comes from the verified token.
2. **RLS filters every statement.** Four policies for `authenticated`, covering select, insert, update and delete.
3. **The application checks too.** Route handlers reject unauthenticated requests before touching the database. Convenience and depth — not the boundary.

### The subtle one

The update policy needs both `USING` and `WITH CHECK`:

```sql
CREATE POLICY contacts_update_own ON public.contacts
  FOR UPDATE TO authenticated
  USING       ((SELECT auth.user_id()) = user_id)
  WITH CHECK  ((SELECT auth.user_id()) = user_id);
```

`USING` decides which rows a statement may *see or target*. `WITH CHECK` decides what a row is allowed to *look like afterwards*. Without the second clause, a user could edit a row they legitimately own and set `user_id` to somebody else's — handing the row away, or planting a row inside another user's list. A `BEFORE UPDATE` trigger pins `user_id` to its previous value as well, so that specific attack fails twice.

**A consequence worth noticing:** `PATCH` or `DELETE` against another user's contact returns **404, not 403**. Under RLS the row is invisible, so from the caller's side it does not exist — which also avoids confirming that a given id is real. The status code is an information-disclosure decision, not an accident.

## 3. Verified, not asserted

The claim "no secret reaches the browser" is checked against the actual production build rather than believed:

```bash
npm run build
grep -rl "$NEON_AUTH_COOKIE_SECRET" .next/static/   # no matches
grep -rl "DATABASE_URL"             .next/static/   # no matches
```

A scripted two-account check drives the real HTTP API end to end: sign up two throwaway accounts, have User A create a contact, then have User B try to list, edit, re-parent and delete it. Every attempt returns 404; a signed-out client gets 401; A's row is untouched afterwards. It exercises route handlers, the Data API and the Postgres policies together, so it fails if *any* layer regresses.

Alongside it, 28 tests cover the trusted validation module — the one the route handlers call on every write, not the browser form. They assert that a client-supplied `user_id` is stripped, that unknown sort parameters fall back to safe defaults instead of reaching the database, and that `%`, `_` and `\` in a search term are escaped so a user cannot alter the match pattern.

## 4. What I'd do differently

- **No pagination.** The list loads every matching row. Fine for a personal network; at a few thousand contacts it needs keyset pagination on `(user_id, created_at, id)`.
- **Search is `ILIKE`.** Wildcards are escaped and it is pushed down to Postgres, but it is substring matching with no ranking or typo tolerance. A `tsvector` column with a GIN index is the next step.
- **Hard deletes behind a browser `confirm()`.** A soft-delete column plus an undo toast would be both friendlier and recoverable.
- **Tests cover validation and the API, not the UI.** Playwright over sign-in → add → edit → delete would close the gap.
- **The auth SDKs are pre-1.0.** Pinned in the lockfile, but a minor bump could still break.
