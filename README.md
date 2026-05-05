# The One Million Miles Challenge

This is a Next.js 16 app for the One Million Miles Challenge, a charity fitness campaign supporting Evelina London.

## Local Development

Install dependencies and run the app with:

```bash
npm install
npm run dev
```

The app expects these environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

You can copy the tracked example file to get started:

```bash
cp .env.example .env.local
```

## Supabase Setup

Run the SQL in `supabase-schema.sql`. It creates:

- `user_profiles` so signed-in participants have a fixed leaderboard name
- `miles_submissions` for the public leaderboard
- `submission_proofs` for authenticated screenshot proof metadata
- a private Storage bucket called `activity-proofs`
- RLS policies for public leaderboard reads, authenticated profile writes, and proof access

## Google Login Setup

You need to complete the OAuth setup in Supabase and Google Cloud:

1. In Google Cloud, create an OAuth client for the app.
2. In Supabase Auth, enable the Google provider and paste the Google client ID and secret.
3. Add these redirect URLs in Supabase Auth and Google Cloud:
   - `http://localhost:3000/auth/callback`
   - your production URL with `/auth/callback`
4. In Supabase Auth URL settings, make sure the site URL matches your local or production host.

## Features

- Public leaderboard with challenge progress, trust rankings, and recent activity.
- Anonymous submissions for open participation.
- Google sign-in for authenticated participants.
- Profile-backed display names for signed-in users.
- Optional screenshot proof uploads and an authenticated proof gallery.

## Verification

The current working tree passes:

```bash
npm run lint
npm run build
```
