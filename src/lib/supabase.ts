import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfogjyrqtljeffrufztd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmb2dqeXJxdGxqZWZmcnVmenRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTI0NDksImV4cCI6MjA4NjU4ODQ0OX0.qxYyunerpAAH7rNjlFjnNzgtXE7q3igB5M2PLT2_WRw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
