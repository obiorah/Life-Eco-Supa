console.log('Process Environment Variables:', process.env);

// app/lib/supabase-admin.ts
// Only import dotenv in development
import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

console.log('[supabase-admin] Initializing Supabase admin client module...');

let supabaseAdminClientInstance: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (supabaseAdminClientInstance) {
    return supabaseAdminClientInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('[supabase-admin] SUPABASE_URL:', supabaseUrl ? 'set' : 'not set');
  console.log('[supabase-admin] SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'set' : 'not set');

  if (!supabaseUrl || !serviceRoleKey) {
    const errorMessage = "[supabase-admin] CRITICAL ERROR: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing or empty. These are required for admin-level Supabase operations. Please check your .env file and server environment configuration.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Validate if supabaseUrl is a valid URL
  try {
    new URL(supabaseUrl);
  } catch (e) {
    const errorMessage = `[supabase-admin] CRITICAL ERROR: Invalid SUPABASE_URL format: ${supabaseUrl}. Please check your environment variables.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    supabaseAdminClientInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });
    console.log('[supabase-admin] Supabase admin client instance successfully created.');
    return supabaseAdminClientInstance;
  } catch (error: any) {
    console.error('[supabase-admin] CRITICAL ERROR: Failed to create Supabase admin client instance.', error.message);
    throw error;
  }
}

export const supabaseAdmin = getSupabaseAdminClient();
console.log('[supabase-admin] supabaseAdmin initialized:', !!supabaseAdmin);
