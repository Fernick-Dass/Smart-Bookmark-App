# Smart Bookmark App

Live URL: https://smart-bookmark-app-liard.vercel.app/

## Problems encountered and how I solved them

- **Supabase (data privacy)**  
  During early testing some users could see other users' bookmarks. I enabled Row-Level Security (RLS) on the `bookmarks` table and added a policy that only allows access when `auth.uid() = user_id`. This makes each user's bookmarks private.

- **Google OAuth / redirect URI**  
  Sign-in failed with `redirect_uri_mismatch`. I created a Google OAuth client, added the exact Supabase callback URL (for example: `https://<your-project>.supabase.co/auth/v1/callback`) and `http://localhost:3000` for local testing to the Authorized redirect URIs, then pasted the Client ID and Secret into Supabase → Authentication → Sign In / Providers → Google. Wait a few minutes for propagation and test in an incognito window.
