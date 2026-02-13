import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Create the client only in the browser to avoid build-time errors when env vars
// are not available during static prerender. Client components will run in the
// browser where NEXT_PUBLIC env vars are present.
export const supabase = typeof window !== "undefined" && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);


