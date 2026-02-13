-- Supabase schema and RLS for Smart Bookmark App
create extension if not exists "pgcrypto";

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);

alter table public.bookmarks enable row level security;

create policy if not exists "allow logged-in users to manage own bookmarks" on public.bookmarks
  for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );


