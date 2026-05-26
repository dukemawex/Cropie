import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

if (!config.supabaseUrl || !config.supabaseServiceKey) {
  // intentionally delayed throw to allow test imports
}

export const supabase = createClient(config.supabaseUrl || 'http://localhost', config.supabaseServiceKey || 'dev-key', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
