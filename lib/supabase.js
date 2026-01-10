// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// URL Supabase Anda
const supabaseUrl = 'https://xfabluuefvmxqxfxoizy.supabase.co';

// Anon Key yang benar (publishable key)
const supabaseAnonKey = 'sb_publishable_03pixhcuAdKff9KKna47eA_JGduU97A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);