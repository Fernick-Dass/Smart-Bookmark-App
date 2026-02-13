# Smart Bookmark App

Live URL: ADD_LIVE_VERCEL_URL_HERE

Problems encountered and how they were solved
- Row-Level Security (RLS) exposed other users' data during early testing — solution: enabled RLS and added a policy restricting operations to rows where auth.uid() = user_id.
- Google OAuth redirect mismatch caused sign-in failures — solution: configured OAuth consent screen, created a Google OAuth client, and added the Supabase callback and `http://localhost:3000` as authorized redirect URIs.
- Realtime updates not appearing in other tabs — solution: added a Supabase realtime subscription on the `bookmarks` table and updated client state on INSERT/DELETE/UPDATE; verified Realtime is enabled in Supabase.
- Auth state race conditions on initial load — solution: call `supabase.auth.getUser()` on mount and listen to `onAuthStateChange` to keep UI in sync.
- Build-time env errors when creating Supabase client — solution: only create the Supabase client at runtime (browser) when NEXT_PUBLIC env vars are present.


