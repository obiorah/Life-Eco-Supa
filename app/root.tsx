import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { Header } from "~/components/Header";
import { getBrowserEnvironment } from "~/lib/supabase";
import supabaseAdmin from "~/lib/supabase-admin";
import type { UserProfile } from "~/types/user";
import { useStore } from "~/store/store";
import type { User as AdminUser, UserRole } from "~/types/admin";

import "./tailwind.css";

// Export AppUser as an alias for UserProfile for clarity in child routes
export type AppUser = UserProfile;

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("--- [Server Loader - root] ROOT LOADER CALLED ---");

  let userProfile: UserProfile | null = null;
  let error: string | null = null;
  let env = {};

  try {
    env = getBrowserEnvironment();
    const hardcodedUserId = "19c95443-56d2-4dd4-a551-2874c8e73ff6";
    console.log("[Server Loader - root] Attempting Supabase ADMIN fetch for auth user:", hardcodedUserId);

    const { data: authUserData, error: authError } = await supabaseAdmin.auth.admin.getUserById(
      hardcodedUserId
    );

    if (authError) {
      console.error("[Server Loader - root] Supabase admin auth error fetching user:", authError);
      error = authError.message || "Failed to fetch auth user using admin client";
    } else if (authUserData?.user) {
       console.log("[Server Loader - root] Supabase admin auth fetch successful. Auth User data received:", authUserData.user.id);

       // Query for all necessary profile fields, including group_id.
       // Removed group_name and avatar_url as they do not exist in the profiles table.
       const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, email, full_name, balance, role, created_at, group_id') // Removed group_name and avatar_url
        .eq('id', authUserData.user.id)
        .single();

       if (profileError) {
         console.error("[Server Loader - root] Error fetching profile data:", profileError);
         error = profileError.message || "Failed to fetch user profile data";
       } else if (profileData) {
         // Ensure group_name and avatar_url are not expected here if not selected
         userProfile = profileData as Omit<UserProfile, 'group_name' | 'avatar_url'> & { group_name?: string, avatar_url?: string };
         console.log("[Server Loader - root] Full UserProfile fetched (group_name and avatar_url will be undefined):", userProfile);
       } else {
         console.log("[Server Loader - root] Profile data not found for user ID:", authUserData.user.id);
         error = "User profile not found in database.";
       }
    } else {
      console.log("[Server Loader - root] Supabase admin auth fetch: User not found.");
      error = "Auth user not found";
    }

  } catch (err: any) {
    console.error("[Server Loader - root] UNEXPECTED error caught during loader execution:", err);
    error = `Root loader failed: ${err.message || "An unknown error occurred"}`;
    userProfile = null;
    try {
      env = getBrowserEnvironment();
    } catch (envError) {
      console.error("[Server Loader - root] Error getting ENV even in catch block:", envError);
      env = { error: "Failed to get environment variables" };
    }
  }

  console.log("[Server Loader - root] Returning:", { ENV: env, userProfile: userProfile ? `UserProfile object with id ${userProfile.id}`: null, error });

  return json({
    ENV: env,
    userProfile,
    error,
  });
}


export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useLoaderData<typeof loader>();
  const { ENV = {}, userProfile = null, error = null } = loaderData || {};

  const zustandSetCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    const currentStoreUser = useStore.getState().currentUser;

    if (userProfile) {
      const profileEmail = userProfile.email || '';
      const profileFullName = userProfile.full_name || 'User';
      const profileBalance = userProfile.balance ?? 0;
      const profileRole = (userProfile.role as UserRole) || 'User';
      const profileCreatedAt = userProfile.created_at;
      const profileGroupId = userProfile.group_id;
      // userProfile.group_name will be undefined as it's not selected from DB
      const profileGroupName = userProfile.group_name; // This will be undefined
      // userProfile.avatar_url will be undefined as it's not selected from DB
      const profileAvatarUrl = userProfile.avatar_url; // This will be undefined


      const needsZustandUpdate =
        !currentStoreUser ||
        currentStoreUser.id !== userProfile.id ||
        currentStoreUser.email !== profileEmail ||
        currentStoreUser.fullName !== profileFullName ||
        currentStoreUser.balance !== profileBalance ||
        currentStoreUser.role !== profileRole ||
        (profileCreatedAt && currentStoreUser.createdAt !== (profileCreatedAt ? new Date(profileCreatedAt).toISOString().split('T')[0] : undefined)) ||
        currentStoreUser.groupId !== profileGroupId ||
        currentStoreUser.groupName !== (profileGroupName || currentStoreUser?.groupName || 'Group Placeholder') || // Ensure comparison handles undefined profileGroupName
        currentStoreUser.avatarUrl !== (profileAvatarUrl || currentStoreUser?.avatarUrl || undefined); // Ensure comparison handles undefined profileAvatarUrl


      if (needsZustandUpdate) {
        const userForStore: AdminUser = {
          id: userProfile.id,
          email: profileEmail,
          fullName: profileFullName,
          balance: profileBalance,
          role: profileRole,
          createdAt: profileCreatedAt ? new Date(profileCreatedAt).toISOString().split('T')[0] : (currentStoreUser?.createdAt || new Date().toISOString().split('T')[0]),
          status: currentStoreUser?.status || 'active',
          groupId: profileGroupId || currentStoreUser?.groupId || 'group_placeholder_id',
          // profileGroupName will be undefined, so fallback logic will apply
          groupName: profileGroupName || currentStoreUser?.groupName || 'Group Placeholder',
          // profileAvatarUrl will be undefined, so fallback logic will apply
          avatarUrl: profileAvatarUrl || currentStoreUser?.avatarUrl || undefined,
        };
        zustandSetCurrentUser(userForStore);
        console.log("[Layout Effect] Updated currentUser in Zustand:", userForStore);
      } else {
        console.log("[Layout Effect] Skipping Zustand update, data appears consistent with userProfile:", userProfile.id);
      }
    } else if (error) {
      console.warn("[Layout Effect] No user profile loaded due to error from loader:", error);
    }
  }, [userProfile, error, zustandSetCurrentUser]);


  if (!loaderData) {
    console.warn("[Layout Component] Warning: useLoaderData() returned undefined. Using default values.");
  }

  if (error && !userProfile) {
     console.error("[Layout Component] Error message received from loader:", error);
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50 dark:bg-gray-950">
        <Header />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error("Root Error Boundary caught error:", error);

  let errorMessage = "An unexpected error occurred.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    if (typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
       errorMessage = String(error.data.message) || error.statusText;
    } else if (typeof error.data === 'string') {
       errorMessage = error.data || error.statusText;
    } else {
       errorMessage = error.statusText;
    }
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Error</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full flex items-center justify-center bg-red-100">
        <div className="text-center p-8 bg-white shadow-md rounded">
          <h1 className="text-2xl font-bold text-red-600">Application Error</h1>
          <p className="mt-2">Status: {errorStatus}</p>
          <p className="mt-2">{errorMessage}</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Go Home</a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
