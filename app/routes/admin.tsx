import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useNavigation, useRouteError, isRouteErrorResponse, Form } from "@remix-run/react"; // Added Form
import { useUserRole } from "~/hooks/useUserRole";
import { AccessDenied } from "~/components/AccessDenied";
import { cn } from "~/lib/utils";
import { UsersTabContent } from "~/components/admin/UsersTabContent";
import { GroupsManagement } from "~/components/admin/GroupsManagement";
import { EssenceSettings } from "~/components/admin/EssenceSettings";
import { BackupRestore } from "~/components/admin/BackupRestore";
import supabaseAdmin from "~/lib/supabase-admin"; // Import Supabase admin client
import type { Group, User, UserRole } from "~/types/admin"; // Import types

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Admin" },
    { name: "description", content: "Admin section for Life Economy" },
  ];
};

// --- Loader to fetch Profiles and Groups ---
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("[Server Loader - admin] Starting loader execution...");
  // TODO: Add proper authentication/authorization check here

  let profilesData, profilesError, groupsData, groupsError;

  // --- Fetch Profiles ---
  try {
    console.log("[Server Loader - admin] Attempting to fetch profiles...");
    const query = supabaseAdmin
      .from('profiles') // <--- Changed from 'users' to 'profiles'
      .select('id, email, full_name, role, group_id, balance, created_at, is_suspended')
      .order('full_name', { ascending: true });

    ({ data: profilesData, error: profilesError } = await query);

    if (profilesError) {
      console.error("[Server Loader - admin] Supabase error fetching profiles:", profilesError);
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }
    console.log(`[Server Loader - admin] Successfully fetched ${profilesData?.length ?? 0} profiles.`);

  } catch (error: any) {
    console.error("[Server Loader - admin] Error during profile fetch:", error);
    throw new Response(error.message || "An error occurred fetching profiles.", { status: 500 });
  }

  // --- Fetch Groups ---
  try {
    console.log("[Server Loader - admin] Attempting to fetch groups...");
    const query = supabaseAdmin
      .from('groups')
      .select('id, name, description, type, created_at')
      .order('name', { ascending: true });

    ({ data: groupsData, error: groupsError } = await query);

    if (groupsError) {
      console.error("[Server Loader - admin] Supabase error fetching groups:", groupsError);
      throw new Error(`Failed to fetch groups: ${groupsError.message}`);
    }
    console.log(`[Server Loader - admin] Successfully fetched ${groupsData?.length ?? 0} groups.`);

  } catch (error: any) {
    console.error("[Server Loader - admin] Error during group fetch:", error);
    throw new Response(error.message || "An error occurred fetching groups.", { status: 500 });
  }

  // --- Map Data ---
  try {
    console.log("[Server Loader - admin] Mapping fetched data...");
    // Map Supabase data to frontend types (snake_case to camelCase)
    const users: User[] = (profilesData || []).map(p => ({ // <-- Changed variable name u to p for clarity
      id: p.id,
      email: p.email,
      fullName: p.full_name,
      role: p.role as UserRole, // Cast role
      groupId: p.group_id,
      balance: p.balance ?? 0, // Default balance to 0 if null
      createdAt: p.created_at,
      isSuspended: p.is_suspended ?? false, // Handle potential null
      // Derive status based on isSuspended
      status: p.is_suspended ? 'Suspended' : 'Active',
      // We need group name here, let's fetch it separately or join later
      groupName: groupsData?.find(g => g.id === p.group_id)?.name || 'N/A', // Add group name
    }));

    const groups: Group[] = (groupsData || []).map(g => ({
      id: g.id,
      name: g.name,
      description: g.description,
      type: g.type,
      createdAt: g.created_at,
      // Update user count calculation based on profiles data
      userCount: users.filter(u => u.groupId === g.id).length,
    }));

    console.log(`[Server Loader - admin] Data mapping complete. Returning ${users.length} users (profiles) and ${groups.length} groups.`);
    return json({ users, groups }); // Keep 'users' key for consistency in frontend components

  } catch (error: any) {
    console.error("[Server Loader - admin] Error during data mapping:", error);
    throw new Response(error.message || "An error occurred processing admin data.", { status: 500 });
  }
}

// --- Action Function for Group and Profile CRUD ---
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  console.log(`[Server Action - admin] Received intent: ${intent}`);
  console.log("[Server Action - admin] Form Data:", Object.fromEntries(formData)); // Log form data

  // TODO: Add proper authorization check (ensure user is Super Admin)

  try {
    switch (intent) {
      // --- Group Actions ---
      case "create-group": {
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const type = formData.get("type") as string;
        if (!name) return json({ success: false, error: "Group Name is required.", intent }, { status: 400 });

        const { error } = await supabaseAdmin.from('groups').insert([{ name, description, type }]);
        if (error) {
          console.error("[Server Action - admin] Error creating group:", error);
          return json({ success: false, error: error.message || "Failed to create group.", intent }, { status: 500 });
        }
        console.log(`[Server Action - admin] Group created: ${name}`);
        return json({ success: true, intent, message: `Group "${name}" created successfully.` });
      }
      case "update-group": {
        const groupId = formData.get("groupId") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const type = formData.get("type") as string;
        if (!groupId) return json({ success: false, error: "Group ID missing.", intent }, { status: 400 });
        if (!name) return json({ success: false, error: "Group Name required.", intent }, { status: 400 });

        const { error } = await supabaseAdmin.from('groups').update({ name, description, type, updated_at: new Date().toISOString() }).eq('id', groupId);
        if (error) {
          console.error("[Server Action - admin] Error updating group:", error);
          return json({ success: false, error: error.message || "Failed to update group.", intent }, { status: 500 });
        }
        console.log(`[Server Action - admin] Group updated: ${groupId}`);
        return json({ success: true, intent, message: `Group "${name}" updated successfully.` });
      }
      case "delete-group": {
        const groupId = formData.get("groupId") as string;
        if (!groupId) return json({ success: false, error: "Group ID missing.", intent }, { status: 400 });

        // Check if any profiles belong to this group
        const { count, error: countError } = await supabaseAdmin
          .from('profiles') // <--- Changed from 'users' to 'profiles'
          .select('*', { count: 'exact', head: true })
          .eq('group_id', groupId);

        if (countError) {
            console.error("[Server Action - admin] Error checking profiles in group:", countError);
            return json({ success: false, error: "Failed to verify group members.", intent }, { status: 500 });
        }
        if (count !== null && count > 0) {
            return json({ success: false, error: `Cannot delete group with ${count} member(s). Reassign or remove members first.`, intent }, { status: 400 });
        }

        // Proceed with group deletion if no members
        const { error } = await supabaseAdmin.from('groups').delete().eq('id', groupId);
        if (error) {
          console.error("[Server Action - admin] Error deleting group:", error);
          return json({ success: false, error: error.message || "Failed to delete group.", intent }, { status: 500 });
        }
        console.log(`[Server Action - admin] Group deleted: ${groupId}`);
        return json({ success: true, intent, message: "Group deleted successfully." });
      }

      // --- Profile (User) Actions ---
      case "create-user": {
        const email = formData.get("email") as string;
        const fullName = formData.get("fullName") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as UserRole;
        const groupId = formData.get("groupId") as string | null;

        if (!email || !fullName || !password || !role) {
          return json({ success: false, error: "Missing required fields (Email, Full Name, Password, Role).", intent }, { status: 400 });
        }

        let authUserId: string | undefined;

        // 1. Create Auth User
        try {
          console.log(`[Server Action - admin] Attempting to create Auth user for: ${email}`);
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Optionally auto-confirm email
            // You can add user_metadata here if needed
            // user_metadata: { full_name: fullName } // Example, but we store it in profiles
          });

          if (authError) {
            console.error("[Server Action - admin] Error creating Supabase Auth user:", authError);
            // Handle specific auth errors (e.g., user already exists)
            if (authError.message.includes("User already registered")) {
               return json({ success: false, error: `Authentication user with email "${email}" already exists.`, intent }, { status: 409 }); // 409 Conflict
            }
            throw new Error(`Failed to create authentication user: ${authError.message}`);
          }

          if (!authData?.user?.id) {
            throw new Error("Auth user created but ID is missing.");
          }

          authUserId = authData.user.id;
          console.log(`[Server Action - admin] Auth user created successfully: ${email} (ID: ${authUserId})`);

        } catch (error: any) {
          console.error("[Server Action - admin] Failure during Auth user creation step:", error);
          // Return the error from the Auth step
          return json({ success: false, error: error.message || "Failed to create authentication user.", intent }, { status: 500 });
        }


        // 2. Create Profile using the Auth User ID
        try {
          console.log(`[Server Action - admin] Attempting to create profile for Auth user ID: ${authUserId}`);
          const { data: profileData, error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: authUserId, // Use the ID from the created Auth user
              email, // Store email here too for easier querying if needed
              full_name: fullName,
              role,
              group_id: groupId || null,
              balance: 0, // Default balance
              is_suspended: false, // Default suspension status
            })
            .select('id') // Select something to confirm insertion
            .single(); // Expect a single row

          if (profileError) {
            console.error("[Server Action - admin] Error creating profile:", profileError);
            // If profile creation fails, we should ideally roll back (delete) the Auth user
            console.warn(`[Server Action - admin] Profile creation failed for Auth user ${authUserId}. Attempting to delete the orphaned Auth user...`);
            try {
              await supabaseAdmin.auth.admin.deleteUser(authUserId);
              console.log(`[Server Action - admin] Orphaned Auth user ${authUserId} deleted successfully.`);
            } catch (deleteError: any) {
              console.error(`[Server Action - admin] CRITICAL: Failed to delete orphaned Auth user ${authUserId} after profile creation failure:`, deleteError);
              // Return an error indicating the inconsistent state
               return json({ success: false, error: `Profile creation failed (${profileError.message}). CRITICAL: Failed to clean up orphaned Auth user. Manual intervention required.`, intent }, { status: 500 });
            }
            // Return the profile creation error
            return json({ success: false, error: `Profile creation failed: ${profileError.message}. Auth user was rolled back.`, intent }, { status: 500 });
          }

          console.log(`[Server Action - admin] Profile created successfully for user: ${email} (ID: ${profileData?.id})`);
          return json({ success: true, intent, message: `User "${fullName}" created successfully (Auth & Profile).` });

        } catch (error: any) {
           console.error("[Server Action - admin] Failure during profile creation step:", error);
           // Attempt to roll back Auth user if profile insert fails unexpectedly
           if (authUserId) {
               console.warn(`[Server Action - admin] Unexpected error during profile creation for Auth user ${authUserId}. Attempting rollback...`);
               try {
                 await supabaseAdmin.auth.admin.deleteUser(authUserId);
                 console.log(`[Server Action - admin] Orphaned Auth user ${authUserId} deleted successfully.`);
               } catch (deleteError: any) {
                 console.error(`[Server Action - admin] CRITICAL: Failed to delete orphaned Auth user ${authUserId} after profile creation failure:`, deleteError);
                 return json({ success: false, error: `Profile creation failed (${error.message}). CRITICAL: Failed to clean up orphaned Auth user. Manual intervention required.`, intent }, { status: 500 });
               }
           }
           return json({ success: false, error: error.message || "Failed to create profile.", intent }, { status: 500 });
        }
      } // End case "create-user"

      case "update-user": {
        const userId = formData.get("userId") as string;
        const email = formData.get("email") as string;
        const fullName = formData.get("fullName") as string;
        const role = formData.get("role") as UserRole;
        const groupId = formData.get("groupId") as string | null;

        if (!userId) return json({ success: false, error: "User ID (Profile ID) missing.", intent }, { status: 400 });
        if (!email || !fullName || !role) return json({ success: false, error: "Missing required fields (Email, Full Name, Role).", intent }, { status: 400 });

        // **Consider updating Auth user email if it changes**
        // Check if email is different from the current one before attempting update
        // const { data: currentProfile } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();
        // if (currentProfile && currentProfile.email !== email) {
        //   try {
        //     console.log(`[Server Action - admin] Attempting to update Auth user email for ${userId} to ${email}`);
        //     await supabaseAdmin.auth.admin.updateUserById(userId, { email: email });
        //     console.log(`[Server Action - admin] Auth user email updated successfully.`);
        //   } catch (authError: any) {
        //      console.error("[Server Action - admin] Error updating Auth user email:", authError);
        //      return json({ success: false, error: `Failed to update authentication email: ${authError.message}`, intent }, { status: 500 });
        //   }
        // }

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            email, // Update email in profile too
            full_name: fullName,
            role,
            group_id: groupId || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (error) {
          console.error("[Server Action - admin] Error updating profile:", error);
           if (error.code === '23505') { // Handle potential email conflict on update
             return json({ success: false, error: `Profile with email "${email}" already exists.`, intent }, { status: 409 });
          }
          return json({ success: false, error: error.message || "Failed to update profile.", intent }, { status: 500 });
        }
        console.log(`[Server Action - admin] Profile updated: ${userId}`);
        return json({ success: true, intent, message: `Profile "${fullName}" updated successfully.` });
      }

       case "suspend-user": {
        const userId = formData.get("userId") as string;
        if (!userId) return json({ success: false, error: "User ID (Profile ID) missing.", intent }, { status: 400 });

        // **Consider if suspending should also affect the Auth user state (e.g., ban_duration)**
        // await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'infinite' }); // Example

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ is_suspended: true, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (error) {
          console.error("[Server Action - admin] Error suspending profile:", error);
          return json({ success: false, error: error.message || "Failed to suspend profile.", intent }, { status: 500 });
        }
        console.log(`[Server Action - admin] Profile suspended: ${userId}`);
        return json({ success: true, intent, message: `Profile suspended successfully.` });
      }

      case "restore-user": {
        const userId = formData.get("userId") as string;
        if (!userId) return json({ success: false, error: "User ID (Profile ID) missing.", intent }, { status: 400 });

         // **Consider if restoring should also affect the Auth user state**
         // await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'none' }); // Example

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ is_suspended: false, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (error) {
          console.error("[Server Action - admin] Error restoring profile:", error);
          return json({ success: false, error: error.message || "Failed to restore profile.", intent }, { status: 500 });
        }
        console.log(`[Server Action - admin] Profile restored: ${userId}`);
        return json({ success: true, intent, message: `Profile restored successfully.` });
      }

      case "delete-user": {
        const userId = formData.get("userId") as string;
        if (!userId) return json({ success: false, error: "User ID (Profile ID) missing.", intent }, { status: 400 });

        // **CRITICAL: Delete Auth user FIRST**
        try {
          console.log(`[Server Action - admin] Attempting to delete Auth user: ${userId}`);
          await supabaseAdmin.auth.admin.deleteUser(userId);
          console.log(`[Server Action - admin] Auth user deleted successfully: ${userId}`);
        } catch (authError: any) {
           console.error("[Server Action - admin] Error deleting auth user:", authError);
           // If the auth user doesn't exist, maybe proceed? Or return error?
           // For now, return an error to prevent deleting only the profile.
           return json({ success: false, error: `Failed to delete auth user: ${authError.message}. Profile not deleted.`, intent }, { status: 500 });
        }

        // If Auth user deletion was successful, proceed to delete the profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (profileError) {
          console.error("[Server Action - admin] Error deleting profile after Auth user deleted:", profileError);
          // This leaves an orphaned Auth user (though deleted) - less critical than the other way around, but still an issue.
          return json({ success: false, error: `Auth user deleted, but failed to delete profile: ${profileError.message}. Manual cleanup might be needed.`, intent }, { status: 500 });
        }

        console.log(`[Server Action - admin] Profile deleted successfully: ${userId}.`);
        return json({ success: true, intent, message: "User (Auth & Profile) deleted successfully." });
      }

       case "change-user-password": {
         const userId = formData.get("userId") as string;
         const newPassword = formData.get("newPassword") as string;
         if (!userId || !newPassword) {
           return json({ success: false, error: "User ID and new password are required.", intent }, { status: 400 });
         }

         try {
            const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: newPassword });
            if (error) throw error;
            console.log(`[Server Action - admin] Password successfully changed via Supabase Auth for user ${userId}.`);
            return json({ success: true, intent, message: `Password changed successfully for user ${userId}.` });
         } catch(error: any) {
             console.error("[Server Action - admin] Error changing password via Supabase Auth:", error);
             return json({ success: false, error: error.message || "Failed to change password.", intent }, { status: 500 });
         }
       }


      default:
        return json({ success: false, error: "Invalid intent.", intent: 'unknown' }, { status: 400 });
    }
  } catch (error: any) {
    console.error(`[Server Action - admin] Unexpected error for intent ${intent}:`, error);
    return json({ success: false, error: error.message || "An unexpected server error occurred.", intent }, { status: 500 });
  }
}


// --- Icons ---
function UsersIcon(props: React.SVGProps<SVGSVGElement>) { /* ... icon svg ... */ return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function SettingsIcon(props: React.SVGProps<SVGSVGElement>) { /* ... icon svg ... */ return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 .54 1.73v.5c0 .83-.44 1.56-1.17 1.95l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1.17-1.95v-.5c0-.83.44-1.56 1.17-1.95l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>; }

// --- Tab Content Components ---

// Updated MasterTabContent to accept groups and pass them down
// No changes needed here as it receives the mapped 'users' array
function MasterTabContent({ groups, users }: { groups: Group[], users: User[] }) {
  return (
    <div className="p-4 border rounded-b-md dark:border-gray-700 bg-gray-50 dark:bg-gray-950 space-y-6">
       <GroupsManagement groups={groups} users={users} />
       <EssenceSettings />
       <BackupRestore />
    </div>
  );
}

// --- Main Admin Component ---
type AdminTab = "users" | "master";

export default function Admin() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const userRole = useUserRole();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [isClient, setIsClient] = useState(false);

  // Use state derived from loader data
  const [users, setUsers] = useState(loaderData.users);
  const [groups, setGroups] = useState(loaderData.groups);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update state when loader data changes (Remix revalidation)
  useEffect(() => {
    setUsers(loaderData.users);
    setGroups(loaderData.groups);
  }, [loaderData]);


  // Display action messages (e.g., success/error toasts)
  // Also handle closing modals on successful actions if needed
  useEffect(() => {
    if (actionData?.intent && actionData?.success) {
        console.log(`Action Success (${actionData.intent}): ${actionData.message}`);
        // TODO: Implement success toast notification
        // Example: if (actionData.intent === 'create-user') { closeAddUserModal(); }
    } else if (actionData?.intent && actionData?.error) {
       console.error(`Action Error (${actionData.intent}): ${actionData.error}`);
       // TODO: Implement error toast notification
       // Error messages are now handled within the modals via useActionData
    }
  }, [actionData]);


  if (!isClient || userRole !== 'Super Admin') {
    if (!isClient) return null;
    return <AccessDenied requiredRole="Super Admin" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        // Pass mapped 'users' (from profiles), groups, navigation, actionData
        return <UsersTabContent users={users} groups={groups} navigation={navigation} actionData={actionData} />;
      case "master":
        // Pass mapped 'users' (from profiles), groups
        return <MasterTabContent groups={groups} users={users} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Admin Console</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "users"
              ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
          )}
        >
          <UsersIcon className="h-5 w-5" />
          Users
        </button>
        <button
          onClick={() => setActiveTab("master")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "master"
              ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
          )}
        >
          <SettingsIcon className="h-5 w-5" />
          Master
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="mt-0">
        {renderContent()}
      </div>
    </div>
  );
}

// --- Error Boundary ---
export function ErrorBoundary() {
    const error = useRouteError();
    console.error("[Admin ErrorBoundary] Caught error:", error);

    let errorMessage = "An unexpected error occurred loading the Admin Console.";
    let errorDetails = "";

    if (isRouteErrorResponse(error)) {
        errorMessage = `Error: ${error.status} ${error.statusText}`;
        // Display the data from the Response directly if it's a string
        errorDetails = typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2);
    } else if (error instanceof Error) {
        errorMessage = `Application Error: ${error.message}`;
        errorDetails = error.stack || "No stack trace available.";
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">Admin Console Error</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-200" role="alert">
                <strong className="font-bold">Oops!</strong>
                <span className="block sm:inline"> {errorMessage}</span>
                <details className="mt-2 text-sm">
                    <summary className="cursor-pointer">Details</summary>
                    <pre className="mt-1 p-2 bg-red-50 dark:bg-red-800 rounded overflow-auto text-xs">
                        {errorDetails}
                    </pre>
                </details>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
                Please check the server console logs for more specific information about the failure.
                Common issues include missing environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) or database schema mismatches (e.g., trying to access a non-existent table or column).
            </p>
             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                If the error mentions 'relation "public.users" does not exist', ensure all database queries in <code>app/routes/admin.tsx</code> use <code>.from('profiles')</code> instead.
            </p>
             <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                If the error mentions 'violates foreign key constraint "fk_profiles_user"', ensure the 'create-user' action first creates an authentication user via <code>supabaseAdmin.auth.admin.createUser</code> and then uses the returned ID to insert into the <code>profiles</code> table.
            </p>
        </div>
    );
}
