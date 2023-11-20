import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://wizfivlmqmsbcnrdvasi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpemZpdmxtcW1zYmNucmR2YXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg5OTc2MTYsImV4cCI6MjAxNDU3MzYxNn0.OxIRtTQioGqBOnUSqR_YEWG4Lc3qXedxPagfRTmTwtI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
