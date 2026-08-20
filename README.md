# W.D. Mohammed Islamic Center

Community website for the Greensboro masjid and nonprofit at 3015 E. Bessemer Ave.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (swap `DATABASE_URL` for Postgres in production)
- Auth.js credentials login (`MEMBER` / `ADMIN`)
- Light WebGL hero (pauses off-screen, respects reduced motion)

## Setup

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open http://localhost:3000

### Demo logins (change after first deploy)

| Role  | Email             | Password         |
| ----- | ----------------- | ---------------- |
| Admin | admin@wdmic.org   | WdmicAdmin2026!  |
| Member| member@wdmic.org  | MemberDemo2026!  |

## What the database stores

Announcements, Jumu'ah services, events, Muslim Journal issues, member-only documents, contact messages, and user accounts.

## Production notes

- Set `AUTH_SECRET` to a long random value.
- Replace SQLite with Postgres when you host (Vercel + Neon, Railway, etc.).
- Add a real donation processor on `/donate` when the board chooses one.
- Rotate demo passwords and create real member accounts from Prisma Studio (`npx prisma studio`).
