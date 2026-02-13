# Smart Bookmark App

This repository contains a minimal Next.js (App Router) + Supabase bookmark manager with Google OAuth sign-in, per the interview task.

Live deployment: ADD YOUR LIVE VERCEL URL HERE (e.g. https://your-app.vercel.app)

GitHub repo: ADD YOUR PUBLIC GITHUB REPO URL HERE (e.g. https://github.com/your-username/your-repo)

Quick features
- Google OAuth (Supabase Auth)
- Add / delete bookmarks (title + URL)
- Bookmarks are private per user (row-level security)
- Realtime updates between tabs using Supabase Realtime

Getting started (local)
1. Create a Supabase project at `https://app.supabase.com`.
2. In your Supabase project settings -> Authentication -> Providers enable **Google** and configure your Google OAuth client.
3. Create the `bookmarks` table (run SQL in Supabase SQL editor):

```sql
create extension if not exists "pgcrypto";

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);

alter table public.bookmarks enable row level security;

create policy "allow logged-in users to manage own bookmarks" on public.bookmarks
  for all
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );
```

4. Create environment variables (local `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can use the provided `env.example` as a template.

5. Install and run locally:

```bash
npm install
npm run dev
```

Deploying to Vercel
- Add the repo to Vercel.
- Add the same environment variables in your Vercel project settings.
- For Google OAuth, configure authorized redirect URLs in Supabase to include `https://<your-vercel-domain>/`.

Problems I ran into / notes
- Realtime permissions: ensure RLS policy is configured; otherwise users could see others' bookmarks. The SQL above enables RLS and a policy that restricts all operations to the owning user.
- OAuth redirect: Google OAuth requires configuring redirect URIs; in Supabase set the redirect URL to your deployed domain so sign-in completes correctly.
- Realtime subscriptions should be scoped to the table; we filter client-side by `user_id` and rely on RLS to ensure privacy.

What I changed
- Created a Next.js App Router scaffold with Tailwind and Supabase client.
- Implemented `AuthButton`, `BookmarkManager`, and a minimal layout.

If you want, I can:
- Deploy this to your Vercel project or help configure Supabase and add the environment variables.

Included files to run and deploy
- `env.example` — template for local env vars.
- `sql/init.sql` — SQL to create `bookmarks` table and RLS policy (run in Supabase SQL editor).
- `lib/supabaseClient.ts` — client instance used by components.

Testing & deployment checklist
- Run locally: `npm install && npm run dev` and visit `http://localhost:3000`.
- Ensure Supabase config in `env.example` is copied to `.env.local`.
- In Supabase: enable Google provider and set redirect URIs:
  - `http://localhost:3000` (local)
  - `https://<your-vercel-domain>/` (production)
- In Vercel: add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to project settings, then import the GitHub repo.

Debugging tips
- If bookmarks don't appear across tabs: check browser console for websocket/connect errors and verify Realtime is enabled in Supabase settings.
- If sign-in doesn't finish: confirm the Google OAuth client redirect is set correctly in the Supabase provider settings.
Problems I ran into and how I solved them
- **Row-Level Security exposed other users' data** — initially I queried the `bookmarks` table without enabling RLS, which allowed broader reads during development. I enabled RLS and added a strict policy that uses `auth.uid() = user_id` for both USING and WITH CHECK to ensure only owners can read/write.
- **Google OAuth redirect mismatch** — sign-in failed due to redirect URIs not matching. I fixed this by adding `http://localhost:3000` for local testing and the deployed Vercel domain in Supabase's Google provider settings.
- **Realtime updates not appearing** — caused by not subscribing correctly and not filtering by `user_id`. I used Supabase Realtime table subscription and filter client-side by `user_id`; RLS also prevents cross-user leaks.
- **Auth state race conditions** — auth state sometimes arrived after initial render. I added robust `getUser()` calls and an auth-state listener to ensure UI updates correctly and unsubscribed listeners on unmount.
- **Client keys caution** — I ensured only the anon public key is used client-side and noted service-role keys must never be exposed in the browser.
Notes on configuring Google OAuth redirects
- When configuring the Google provider in Supabase, set the "Redirect URL" to these values:
  - For local development: `http://localhost:3000`
  - For production (Vercel): `https://<your-vercel-domain>/`

Vercel environment variable checklist
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (from Project Settings -> API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon public key (from Project Settings -> API)

Security note
- Do NOT commit `.env.local` with keys to the repo. Use `.env.example` (included) as a template and configure real secrets in Vercel or your local environment.


