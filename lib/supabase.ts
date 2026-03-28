import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nnbyswnqgmjpfhxxaoou.supabase.co";
const supabaseAnonKey = "sb_publishable_bVE7Qpx-h-npg-PX7u8yHw_Lb4HEPZ0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);