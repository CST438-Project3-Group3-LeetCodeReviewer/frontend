import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ditrpxtnudjmjfobiaul.supabase.co';
const supabaseAnonKey = 'sb_publishable_i8TSjv1_9X9QvBYtlAYe0Q__FKxXsb6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
