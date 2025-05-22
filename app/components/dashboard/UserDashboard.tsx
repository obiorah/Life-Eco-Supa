import React from 'react';
import { DashboardCard } from '~/components/DashboardCard';
import { BalanceHistoryGraph } from './BalanceHistoryGraph';
import { GroupLeaderboard } from './GroupLeaderboard';
// import { useStore } from '~/store/store'; // Remove store usage for user data
import { DollarSignIcon, ActivityIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import type { User } from '~/types/admin'; // Import User type

// Define props for the component
interface UserDashboardProps {
  currentUser: User;
}

export function UserDashboard({ currentUser }: UserDashboardProps) {
  // Remove reliance on useStore for currentUser
  // const { users, currentUser } = useStore(); // No longer needed

  if (!currentUser) {
    // This case should ideally be handled by the parent component/loader
    return <p>Error: User data not provided.</p>;
  }

  // Use data from the currentUser prop
  const currentBalance = currentUser.balance;
  const assignedActivities = 5; // Placeholder - Fetch this data later if needed
  const recentRewards = 150; // Placeholder - Fetch this data later if needed
  const recentFines = 20; // Placeholder - Fetch this data later if needed
  const expensesCharged = 75; // Placeholder - Fetch this data later if needed

  // Mock recent activity for the user - Fetch this data later if needed
  const mockUserActivity = [
    { id: 1, text: "Received 50 ESSENCE reward for 'Project Alpha'." },
    { id: 2, text: "Charged 10 ESSENCE for 'Late Submission'." },
    { id: 3, text: "Assigned new activity: 'Beta Testing'." },
    { id: 4, text: "Transferred 25 ESSENCE to Bob." },
  ];

  return (
    <div className="space-y-6">
      {/* Personal Highlights Cards - Use real balance */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="My ESSENCE Balance" value={Number(currentBalance).toLocaleString()} icon={<DollarSignIcon className="h-6 w-6 text-green-500" />} />
        <DashboardCard title="My Assigned Activities" value={assignedActivities.toString()} icon={<ActivityIcon className="h-6 w-6 text-yellow-500" />} />
        <DashboardCard title="Recent Rewards / Fines" value={`${recentRewards} / ${recentFines}`} icon={<TrendingUpIcon className="h-6 w-6 text-teal-500" />} />
        <DashboardCard title="Expenses Charged" value={expensesCharged.toLocaleString()} icon={<TrendingDownIcon className="h-6 w-6 text-orange-500" />} />
      </div>

      {/* Visuals and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
           {/* Pass the actual user ID */}
           <BalanceHistoryGraph userId={currentUser.id} />
           <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-3 text-lg font-semibold">My Recent Activity</h3>
              {mockUserActivity.length > 0 ? (
                <ul className="space-y-2">
                  {mockUserActivity.map((activity) => (
                    <li key={activity.id} className="border-b pb-1 text-sm dark:border-gray-600">
                      {activity.text}
                    </li>
                  ))}
                </ul>
              ) : (
                 <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>
              )}
           </div>
        </div>

        {/* Sidebar/Leaderboard - Pass actual group and user IDs */}
        <div className="lg:col-span-1">
           {currentUser.group_id && (
             <GroupLeaderboard groupId={currentUser.group_id} currentUserId={currentUser.id} />
           )}
           {/* Other user-specific sidebar items could go here */}
        </div>
      </div>
    </div>
  );
}
