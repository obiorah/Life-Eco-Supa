import { useState } from "react"; // Removed Fragment, useEffect
import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react"; // Removed Form, useActionData
import { getSupabaseAdmin } from "~/utils/supabase.server"; // Import the new utility function
import { ChangePasswordModal } from "~/components/settings/ChangePasswordModal"; // Import the component

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Account Settings" },
    { name: "description", content: "Manage your account settings." },
  ];
};

import type { UserProfile } from "~/types/user"; // Keep UserProfile import

// Loader updated to use 'profiles' table
export async function loader({ request }: LoaderFunctionArgs) {
  // Explicitly get the Supabase admin client within the loader
  console.log("[Server Loader - settings] Attempting to get Supabase admin client.");
  const supabase = await getSupabaseAdmin(); // Use the async utility function

  const hardcodedUserId = "19c95443-56d2-4dd4-a551-2874c8e73ff6";
  let userProfile: UserProfile | null = null;
  let error: string | null = null;

  console.log(`[Server Loader - settings] Supabase client obtained. Attempting to fetch profile for user ID: ${hardcodedUserId} from 'profiles' table.`);

  if (!hardcodedUserId) {
     throw new Response("User not authenticated", { status: 401 });
  }

  try {
    console.log("[Server Loader - settings] Supabase admin client obtained successfully.");
    const { data, error: dbError } = await supabase
      .from('profiles') // Query the profiles table
      .select('id, email, full_name, created_at')
      .eq('id', hardcodedUserId)
      .single();

    if (dbError) {
      console.error("[Server Loader - settings] Supabase DB error fetching user profile from 'profiles':", dbError);
      // Add specific check for relation not existing, though it should exist now
      if (dbError.code === '42P01') { // PostgreSQL error code for undefined_table
        throw new Error(`Database error: The table 'public.profiles' does not seem to exist or is inaccessible. Details: ${dbError.message}`);
      }
      throw new Error(dbError.message || "Failed to fetch user profile");
    }

    if (data) {
      userProfile = data as UserProfile;
    } else {
      // This case might happen if the user exists in auth.users but not profiles
      console.warn(`[Server Loader - settings] Profile not found in 'profiles' table for user ID: ${hardcodedUserId}`);
      throw new Response("User profile not found in profiles table", { status: 404 });
    }

  } catch (err: any) {
    console.error("[Server Loader - settings] Error caught during profile fetch:", err);
    error = err.message || "An unknown error occurred fetching profile";
    // Ensure the error is re-thrown so the ErrorBoundary catches it
    if (err instanceof Response) {
        throw err; // Re-throw Response objects directly
    } else {
        // Wrap other errors in a Response or just throw them
        // Throwing the original error might provide more details in logs
        throw new Response(error, { status: 500 });
    }
  }

  console.log("[Server Loader - settings] Returning:", { userProfile, error });
  // Error should not be part of the successful return data if it was thrown
  return json({ userProfile });
}

// Action function remains the same - it interacts with auth.users, not profiles
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const userId = formData.get("userId") as string;

  console.log(`[Server Action - settings] Received password change request for user ID: ${userId}`);

  if (!userId) {
    return json({ success: false, error: "User ID is missing." }, { status: 400 });
  }
  if (!password || !confirmPassword) {
    return json({ success: false, error: "Password fields cannot be empty." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return json({ success: false, error: "Passwords do not match." }, { status: 400 });
  }
  if (password.length < 6) {
    return json({ success: false, error: "Password must be at least 6 characters long." }, { status: 400 });
  }

  try {
    console.log(`[Server Action - settings] Attempting to update password for user: ${userId}`);
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: password }
    );

    if (error) {
      console.error("[Server Action - settings] Supabase auth error updating password:", error);
      return json({ success: false, error: error.message || "Failed to update password." }, { status: 500 });
    }

    console.log("[Server Action - settings] Password updated successfully for user:", userId, data?.user?.id);
     return json({ success: true, message: "Password updated successfully!" });

  } catch (err: any) {
    console.error("[Server Action - settings] Unexpected error during password update:", err);
    return json({ success: false, error: err.message || "An unexpected error occurred." }, { status: 500 });
  }
}

// --- AccountSettings Component ---
// No changes needed here as it consumes data from the loader,
// and the data structure (UserProfile) remains the same.
export default function AccountSettings() {
  // Loader now returns { userProfile } directly on success
  const { userProfile } = useLoaderData<typeof loader>();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Note: The loader now throws on error, so loaderError won't be present here.
  // Errors are handled by the ErrorBoundary.

  if (!userProfile) {
     // This case should ideally be caught by the loader throwing a 404 or the ErrorBoundary
     return (
       <div className="mx-auto max-w-4xl space-y-8 text-center">
         <h1 className="text-3xl font-bold">Account Settings</h1>
         <p>Could not load user profile information.</p>
       </div>
     );
  }

  const memberSince = userProfile.created_at
    ? new Date(userProfile.created_at).toLocaleDateString()
    : "N/A";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold">Account Settings</h1>

      {/* Profile Information Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-1 text-xl font-semibold">Profile Information</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Your account details and preferences
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              User ID
            </label>
            <p className="text-sm">{userProfile.id || 'N/A'}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Name
            </label>
            <p className="text-sm">{userProfile.full_name || 'N/A'}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Email
            </label>
            <p className="text-sm">{userProfile.email || 'N/A'}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Member Since
            </label>
            <p className="text-sm">{memberSince}</p>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-1 text-xl font-semibold">Security</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Manage your password and security settings
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your account password.
            </p>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Change password
            </button>
          </div>
          <hr className="dark:border-gray-700" />
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
            <button className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Enable two-factor authentication {/* Still inactive */}
            </button>
          </div>
        </div>
      </div>

      {/* Render the imported modal component */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        setIsOpen={setIsPasswordModalOpen}
        userId={userProfile.id}
      />
    </div>
  );
}

// Error Boundary remains the same - it catches errors thrown by the loader
export function ErrorBoundary() {
  const error = useRouteError();
  console.error("Settings Route Error Boundary caught error:", error);

  let errorMessage = "An unexpected error occurred loading settings.";
  let errorStatus = 500;
  let errorDetails = ""; // For potential extra info

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.data || error.statusText || "Error";
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    // Attempt to get stack trace if available, useful for debugging
    errorDetails = error.stack || "";
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
     <div className="mx-auto max-w-4xl space-y-4 rounded-lg border border-red-300 bg-red-50 p-6 text-center shadow-sm dark:border-red-700 dark:bg-red-950">
       <h1 className="text-2xl font-bold text-red-700 dark:text-red-300">Account Settings Error</h1>
       <p className="text-red-600 dark:text-red-400">Status: {errorStatus}</p>
       <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
       {errorDetails && (
         <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded bg-red-100 p-2 text-left text-xs text-red-800 dark:bg-red-900/50 dark:text-red-200">
           <code>{errorDetails}</code>
         </pre>
       )}
       <p className="text-sm text-gray-600 dark:text-gray-400">Please try refreshing the page or contact support if the problem persists.</p>
     </div>
  );
}
