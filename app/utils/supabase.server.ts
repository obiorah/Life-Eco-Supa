// app/utils/supabase.server.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseAdminClientInstance: SupabaseClient | null = null;

export async function getSupabaseAdmin(): Promise<SupabaseClient> {
  if (supabaseAdminClientInstance) {
    return supabaseAdminClientInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("[getSupabaseAdmin] SUPABASE_URL:", supabaseUrl ? "Set" : "Not Set");
  console.log("[getSupabaseAdmin] SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "Set" : "Not Set");
  console.log("[getSupabaseAdmin] Length of SERVICE_ROLE_KEY:", serviceRoleKey?.length);


  if (!supabaseUrl || !serviceRoleKey) {
    const errorMessage = "CRITICAL ERROR: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing or empty. These are required for admin-level Supabase operations.";
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

    // Basic check to see if client was created
    if (!supabaseAdminClientInstance) {
       throw new Error("Failed to create Supabase admin client instance.");
    }

    console.log("[getSupabaseAdmin] Supabase admin client initialized successfully.");
    return supabaseAdminClientInstance;

  } catch (error: any) {
    console.error('[getSupabaseAdmin] CRITICAL ERROR: Failed to create Supabase admin client instance.', error.message);
    throw new Error(`Failed to initialize Supabase admin client: ${error.message}`);
  }
}