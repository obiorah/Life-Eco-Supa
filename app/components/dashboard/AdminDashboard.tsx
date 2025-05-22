import React from 'react';
import { DashboardCard } from '~/components/DashboardCard';
import { GroupOverview } from './GroupOverview';
import { useStore } from '~/store/store';
import { UsersIcon, ActivityIcon, TrendingUpIcon, TrendingDownIcon, UserCheckIcon } from 'lucide-react';

export function AdminDashboard() {
  const { users, groups, transactions } = useStore();
  const currentUser = useStore(state => state.currentUser);

  // Filter users and groups managed by this admin
  const managedGroups = currentUser?.role === 'Super Admin' 
    ? groups 
    : groups.filter(g => users.some(u => u.groupId === g.id && u.id === currentUser?.id));
  
  const managedUsers = currentUser?.role === 'Super Admin'
    ? users
    : users.filter(u => managedGroups.some(g => g.id === u.groupId));

  const totalUsersInGroups = managedUsers.length;
  
  // Calculate rewards and fines from transactions
  const rewardsAndFines = transactions
    .filter(tx => tx.type === 'reward' || tx.type === 'fine')
    .filter(tx => managedUsers.some(u => u.id === tx.userId))
    .reduce((acc, tx) => {
      if (tx.type === 'reward') {
        acc.rewards += tx.credit || 0;
      } else if (tx.type === 'fine') {
        acc.fines += tx.debit || 0;
      }
      return acc;
    }, { rewards: 0, fines: 0 });

  // Calculate total expenses from transactions
  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .filter(tx => managedUsers.some(u => u.id === tx.userId))
    .reduce((sum, tx) => sum + (tx.debit || 0), 0);

  // Get active/suspended user counts
  const activeUsers = managedUsers.filter(u => u.status === 'Active').length;
  const suspendedUsers = managedUsers.filter(u => u.status === 'Suspended').length;

  // Get assigned activities count (placeholder until we implement activities)
  const totalAssignedActivities = managedUsers.length * 2; // Temporary calculation

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <DashboardCard title="Total Users (Managed)" value={totalUsersInGroups.toString()} icon={<UsersIcon className="h-6 w-6 text-blue-500" />} />
        <DashboardCard title="Assigned Activities" value={totalAssignedActivities.toString()} icon={<ActivityIcon className="h-6 w-6 text-yellow-500" />} />
        <DashboardCard title="Total Expenses" value={totalExpenses.toLocaleString()} icon={<TrendingDownIcon className="h-6 w-6 text-orange-500" />} />
        <DashboardCard title="ESSENCE Awarded/Fined" value={`${rewardsAndFines.rewards.toLocaleString()} / ${rewardsAndFines.fines.toLocaleString()}`} icon={<TrendingUpIcon className="h-6 w-6 text-green-500" />} />
        <DashboardCard title="User Status (Active/Susp.)" value={`${activeUsers} / ${suspendedUsers}`} icon={<UserCheckIcon className="h-6 w-6 text-teal-500" />} />
      </div>

      {/* Group Overview Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GroupOverview groups={managedGroups} users={managedUsers} />
        </div>
        <div className="space-y-6">
          <RecentAdminActions />
          {/* Maybe add a panel specific to Admin actions within their groups */}
        </div>
      </div>
    </div>
  );
}
