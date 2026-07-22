# Assertico

An API testing and validation platform — send requests, assert on the
response, diff two payloads, and keep a searchable history of everything
you've run. Built with Next.js 15 (App Router), TypeScript, Prisma,
Supabase Auth, Tailwind CSS, and a small set of hand-rolled UI primitives
styled in the shadcn/ui convention.

## Features

- **Auth** — Supabase-backed signup/login/logout, session refresh via
  middleware, protected dashboard routes.
- **Request builder** — GET/POST/PUT/PATCH/DELETE, editable headers/query
  params/body (JSON, raw, form-data), URL validation, request
  cancellation via `AbortController`.
- **Response viewer** — status, timing, size, pretty-printed & syntax
  highlighted JSON, headers table, copy-to-clipboard.
- **Assertion engine** (`lib/assertion-engine.ts`) — status/body/header
  assertions with `equals`, `notEquals`, `contains`, `exists`,
  `greaterThan`, `lessThan`, and `regex` operators over dot-notation JSON
  paths. No `eval`.
- **Diff checker** (`lib/diff.ts`) — deep, key-order-normalized JSON diff
  with an added/removed/changed summary and a highlighted tree view.
- **History** — every completed request is logged (method, url, headers,
  body, status, duration — never the response body), with server-rendered
  search/filter/pagination and one-click duplicate.
- **Dashboard** — total requests, assertions passed/failed, average
  response time, most-used method, recent activity.
- **Collections** — group saved requests, open/save/update them from the
  builder, delete collections/requests.

## Project structure

```
src/
  app/            Route segments (App Router)
    (auth)/        login, signup
    (dashboard)/   dashboard, requests, collections, assertions, diff,
                   history, settings
    api/           /api/proxy (server-side request execution)
  components/      Presentational + composed UI, grouped by feature
  hooks/           Reusable client-side state (key-value pairs,
                   assertions, request sending, clipboard)
  lib/             Business logic: prisma, supabase, request execution,
                   assertion engine, diff engine, history, collections,
                   auth, validators — kept out of components entirely
  types/           Shared domain types
  utils/           Small stateless helpers (cn, ids, formatting, colors)
prisma/
  schema.prisma    User -> Collection -> Request -> Assertion,
                   plus RequestHistory
```

## Setup

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL, DIRECT_URL, and the Supabase keys in .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

App runs at http://localhost:3000.
