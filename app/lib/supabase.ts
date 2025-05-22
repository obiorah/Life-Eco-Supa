import { createClient } from '@supabase/supabase-js';
// Assuming you might generate types later, keep this import commented or adjust as needed
// import type { Database } from '~/types/supabase';

// Server-side environment variables
const serverSupabaseUrl = process.env.SUPABASE_URL;
const serverSupabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Client-side environment variables (accessed via window.ENV)
// Ensure window.ENV exists before accessing its properties
const clientSupabaseUrl = typeof window !== 'undefined' && window.ENV ? window.ENV.SUPABASE_URL : undefined;
const clientSupabaseAnonKey = typeof window !== 'undefined' && window.ENV ? window.ENV.SUPABASE_ANON_KEY : undefined;

/**
 * Initializes and returns the Supabase client.
 * Throws an error if environment variables are missing on the server.
 * On the client, it attempts to use window.ENV and logs a warning if variables are missing.
 */
export function getSupabaseClient() {
  const isServer = typeof document === 'undefined';
  const supabaseUrl = isServer ? serverSupabaseUrl : clientSupabaseUrl;
  const supabaseAnonKey = isServer ? serverSupabaseAnonKey : clientSupabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isServer) {
      throw new Error('[supabase.ts Server Init] Supabase URL and Anon Key must be provided in server environment variables.');
    } else {
      console.warn('[supabase.ts Client Init] Supabase URL/Key not immediately available. Ensure ENV is loaded via root loader script.');
    }
  }

  // Ensure we pass strings, even if they were potentially undefined (checks above handle the missing case)
  return createClient(supabaseUrl || '', supabaseAnonKey || '');
}

// Helper function to get ONLY the necessary client-side environment variables
// This is called ONLY in the root loader on the server.
export function getBrowserEnvironment() {
  // Ensure this runs server-side and reads from process.env
  if (typeof window !== 'undefined') {
     console.error("getBrowserEnvironment should only be called on the server!");
     return {}; // Or handle appropriately
  }
  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    // Add other client-safe environment variables here if needed
  };
}

// Declare the ENV type on the window object for TypeScript
// Ensure this matches the structure returned by getBrowserEnvironment
declare global {
  interface Window {
    ENV: {
      SUPABASE_URL?: string; // Make optional as it might not be set immediately
      SUPABASE_ANON_KEY?: string; // Make optional
    };
  }
}

// Initialize window.ENV if it doesn't exist (client-side safety)
if (typeof window !== 'undefined' && typeof window.ENV === 'undefined') {
  window.ENV = {};
}
