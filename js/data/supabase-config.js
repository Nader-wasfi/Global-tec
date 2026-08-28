/* ==========================================================================
   SUPABASE CONFIG — paste your own project's values here.
   Find them in your Supabase dashboard: Project Settings → API
     - "Project URL"        → SUPABASE_URL
     - "anon" "public" key  → SUPABASE_ANON_KEY  (NOT the service_role key)
   The anon key is safe to expose in client-side code — it can only do what
   your Row Level Security policies (sql/schema.sql) allow it to do.
   ========================================================================== */

const SUPABASE_URL = "https://eruiekzscuwtqnpmzsjr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YEtj2akiyc9qKHim--oGmQ_CCRQzNMD";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
