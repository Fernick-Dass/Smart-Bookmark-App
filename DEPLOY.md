This document describes how to deploy the Smart Bookmark App to Vercel and finish Supabase configuration.

1) Push the repo to GitHub
- Create a new public repository and push all files.
  ```bash
  git init
  git add .
  git commit -m "Initial commit - Smart Bookmark App"
  git branch -M main
  git remote add origin git@github.com:<you>/<repo>.git
  git push -u origin main
  ```

2) Create Supabase project
- Go to https://app.supabase.com and create a new project.
- In the project, open the SQL editor and run `sql/init.sql` (copy-paste its contents) to create the `bookmarks` table and RLS policy.
- In Project -> Settings -> API, copy the Project URL and anon public key.

3) Configure Google OAuth
- In Supabase dashboard -> Authentication -> Providers -> Google, enable the provider and fill Client ID + Client Secret from the Google Cloud Console.
- Add redirect URIs:
  - `http://localhost:3000` (for local testing)
  - `https://<your-vercel-domain>/` (for production)

4) Configure environment variables (Vercel)
- In your Vercel project settings -> Environment Variables add:
  - `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon key

5) Deploy on Vercel
- Import the GitHub repository into Vercel and deploy. Ensure the environment variables are set for both Preview and Production.
- After deploy, open the site and test Google sign-in.

6) Testing
- Sign in with Google and add bookmarks. Open a second tab (or another browser) and sign in with the same account; adding a bookmark in one tab should appear in the other in real-time.

Troubleshooting
- If sign-in doesn't complete: confirm Google OAuth redirect URIs match the domain shown in the Supabase provider settings.
- If realtime doesn't sync: check Supabase Realtime is enabled and console logs for websocket errors.


