-- Run this in your Supabase SQL editor
-- Dashboard: https://app.supabase.com -> your project -> SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(btrim(first_name)) > 0),
  last_name text not null check (char_length(btrim(last_name)) > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Public leaderboard data
create table if not exists public.miles_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  trust text not null,
  activity_type text not null,
  distance_miles numeric(8, 2) not null check (distance_miles > 0 and distance_miles <= 200),
  created_at timestamptz default now()
);

alter table public.miles_submissions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Auth-only proof metadata so storage paths are never exposed through public reads
create table if not exists public.submission_proofs (
  submission_id uuid primary key references public.miles_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 10485760),
  created_at timestamptz default now()
);

alter table public.miles_submissions enable row level security;
alter table public.submission_proofs enable row level security;
alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
drop policy if exists "Users can insert own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;

create policy "Users can read own profile"
  on public.user_profiles for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.user_profiles for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.user_profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Anyone can read submissions" on public.miles_submissions;
drop policy if exists "Anyone can insert submissions" on public.miles_submissions;
drop policy if exists "Anonymous visitors can insert submissions" on public.miles_submissions;
drop policy if exists "Authenticated users can insert submissions" on public.miles_submissions;

create policy "Anyone can read submissions"
  on public.miles_submissions for select
  using (true);

create policy "Anonymous visitors can insert submissions"
  on public.miles_submissions for insert to anon
  with check (user_id is null);

create policy "Authenticated users can insert submissions"
  on public.miles_submissions for insert to authenticated
  with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Authenticated users can read proofs" on public.submission_proofs;
drop policy if exists "Authenticated users can insert own proofs" on public.submission_proofs;

create policy "Authenticated users can read proofs"
  on public.submission_proofs for select to authenticated
  using (true);

create policy "Authenticated users can insert own proofs"
  on public.submission_proofs for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.miles_submissions
      where public.miles_submissions.id = submission_id
        and public.miles_submissions.user_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'activity-proofs',
  'activity-proofs',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can view proof files" on storage.objects;
drop policy if exists "Authenticated users can upload proof files" on storage.objects;
drop policy if exists "Authenticated users can delete own proof files" on storage.objects;

create policy "Authenticated users can view proof files"
  on storage.objects for select to authenticated
  using (bucket_id = 'activity-proofs');

create policy "Authenticated users can upload proof files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'activity-proofs'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "Authenticated users can delete own proof files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'activity-proofs'
    and split_part(name, '/', 1) = auth.uid()::text
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'miles_submissions'
  ) then
    alter publication supabase_realtime add table public.miles_submissions;
  end if;
end
$$;

create index if not exists idx_submissions_created_at on public.miles_submissions (created_at desc);
create index if not exists idx_submissions_trust on public.miles_submissions (trust);
create index if not exists idx_submissions_user_id on public.miles_submissions (user_id);
create index if not exists idx_submission_proofs_created_at on public.submission_proofs (created_at desc);
create index if not exists idx_submission_proofs_user_id on public.submission_proofs (user_id);
create index if not exists idx_user_profiles_updated_at on public.user_profiles (updated_at desc);

create or replace function public.set_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;

create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_user_profiles_updated_at();
