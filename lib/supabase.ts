import { createClient } from "@supabase/supabase-js";

// Essas chaves você já me mandou, então vou usar as reais aqui
const supabaseUrl = "https://ktqmlgvhiuvwehgjeezo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cW1sZ3ZoaXV2d2VoZ2plZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Mjc2NzMsImV4cCI6MjA2ODAwMzY3M30.LRq0uwI24AvEtO7iGBWaSXTrraQPfHFSY1vEyvP7OIY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
