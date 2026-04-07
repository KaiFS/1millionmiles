-- Run this in your Supabase SQL editor
-- Dashboard: https://app.supabase.com → your project → SQL Editor

-- 1. Create the submissions table
create table if not exists miles_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  trust text not null,
  activity_type text not null,
  distance_miles numeric(8, 2) not null check (distance_miles > 0 and distance_miles <= 200),
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table miles_submissions enable row level security;

-- 3. Allow anyone to read (public leaderboard)
create policy "Anyone can read submissions"
  on miles_submissions for select
  using (true);

-- 4. Allow anyone to insert (open challenge - tighten this later with auth)
create policy "Anyone can insert submissions"
  on miles_submissions for insert
  with check (true);

-- 5. Enable realtime (for the live feed)
alter publication supabase_realtime add table miles_submissions;

-- 6. Useful index for aggregation queries
create index if not exists idx_submissions_created_at on miles_submissions (created_at desc);
create index if not exists idx_submissions_trust on miles_submissions (trust);
