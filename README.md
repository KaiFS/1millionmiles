This is a Next.js 16 app for the NHS Million Miles challenge leaderboard.

## Local Development

Run the app with:

```bash
npm run dev
```

The app expects these environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Supabase Setup

Run the SQL in `supabase-schema.sql`. It creates:

- `miles_submissions` for the public leaderboard
- `submission_proofs` for authenticated screenshot proof metadata
- a private Storage bucket called `activity-proofs`
- RLS policies for public leaderboard reads and authenticated proof access

## Google Login Setup

You need to finish the OAuth setup in Supabase and Google Cloud:

1. In Google Cloud, create an OAuth client for the app.
2. In Supabase Auth, enable the Google provider and paste the Google client ID and secret.
3. Add these redirect URLs in Supabase Auth and Google Cloud:
   - `http://localhost:3000/auth/callback`
   - your production URL with `/auth/callback`
4. In Supabase Auth URL settings, make sure the site URL matches your local or production host.

## What This Adds

- Public visitors can still view the leaderboard and submit miles.
- Signed-in users can sign in with Google.
- Signed-in users can attach an optional screenshot proof when logging miles.
- Signed-in users can browse the authenticated proof gallery.

## Verification

The current implementation passes:

```bash
npm run lint
npm run build
```
