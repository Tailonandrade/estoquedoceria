import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ktqmlgvhiuvwehgjeezo.supabase.co";
const supabaseAnonKey = "eyJhbGciOi..."; // sua anon key completa

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
