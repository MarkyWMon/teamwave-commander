// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kntxkhivhbillsdwvhtm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudHhraGl2aGJpbGxzZHd2aHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDU2MjUsImV4cCI6MjA1MzM4MTYyNX0.1QD_kBoiiGg0ze-cp3RfG5JfpbUCLQgwO3AA68uJy_0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);