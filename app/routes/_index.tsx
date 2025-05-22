import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { useUserRole } from "~/hooks/useUserRole";
import { SuperAdminDashboard } from "~/components/dashboard/SuperAdminDashboard";
import { AdminDashboard } from "~/components/dashboard/AdminDashboard";
import { UserDashboard } from "~/components/dashboard/UserDashboard";
import { GlobalNotifications } from "~/components/GlobalNotifications";
import { DateFilter } from "~/components/DateFilter";
import { GlobalSearch } from "~/components/GlobalSearch";
import type { User, UserRole as AdminUserRole } from "~/types/admin"; // User is the target type for dashboards
import type { AppUser } from "~/root"; // AppUser is UserProfile from root loader
import { ClientOnly } from "~/components/ClientOnly"; // Import ClientOnly

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Dashboard" },
    { name: "description", content: "Welcome to Life Economy!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("[Loader - _index] Index route loader executed.");
  return json({});
}


export default function DashboardIndex() {
  const rootData = useRouteLoaderData<typeof import("~/root").loader>("root");
  // Access userProfile from rootData, which is of type AppUser (UserProfile)
  const userProfileFromRoot = rootData?.userProfile as AppUser | null | undefined;
  const error = rootData?.error;

  // This hook reads from Zustand, which should be updated by root.tsx's useEffect
  const userRoleFromHook = useUserRole();

  // Corrected console.log to use the actual variable name
  console.log("[Component - _index] Rendering dashboard. Data from root loader:", { userProfile: userProfileFromRoot, error });

  const loadingOrErrorFallback = <p>Loading user data or dashboard...</p>;

  if (error) {
    return <p className="text-red-500">Error loading dashboard: {error}</p>;
  }

  if (!userProfileFromRoot) {
     return loadingOrErrorFallback;
  }

  // Transform userProfileFromRoot (AppUser/UserProfile) to the User type for dashboards
  const mappedUserForDashboard: User = {
    id: userProfileFromRoot.id,
    email: userProfileFromRoot.email || '',
    fullName: userProfileFromRoot.full_name || 'User', // Map snake_case to camelCase
    balance: userProfileFromRoot.balance ?? 0,
    role: (userProfileFromRoot.role as AdminUserRole) || 'User', // Cast role string
    createdAt: userProfileFromRoot.created_at ? new Date(userProfileFromRoot.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // Format date YYYY-MM-DD
    status: 'active', // Default status
    groupId: userProfileFromRoot.group_id || 'group_placeholder_id', // Use from profile if available, else default
    groupName: userProfileFromRoot.group_name || 'Group Placeholder', // Use from profile if available, else default
    avatarUrl: userProfileFromRoot.avatar_url || undefined, // Use from profile if available
  };

  const renderDashboardContent = () => {
    // Use userRoleFromHook for role-based rendering logic
    switch (userRoleFromHook) {
      case 'Super Admin':
        return <SuperAdminDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      case 'User':
        return <UserDashboard currentUser={mappedUserForDashboard} />;
      default:
        return <p>Loading dashboard or role ('{userRoleFromHook}') not recognized...</p>;
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
          <DateFilter />
          <GlobalSearch />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <ClientOnly fallback={loadingOrErrorFallback}>
            {() => renderDashboardContent()}
          </ClientOnly>
        </div>

        <div className="lg:col-span-1">
          <GlobalNotifications />
        </div>
      </div>
    </div>
  );
}
