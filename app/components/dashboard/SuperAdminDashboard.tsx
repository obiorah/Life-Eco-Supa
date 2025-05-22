import React from 'react';
import { DashboardCard } from '~/components/DashboardCard';
import { RecentTransactionsFeed } from './RecentTransactionsFeed';
import { RecentAdminActions } from '../admin/RecentAdminActions';
import { SuspendedUsersPanel } from '../admin/SuspendedUsersPanel';
import { AdminShortcuts } from '../admin/AdminShortcuts';
import { useStore } from '~/store/store';
import { DollarSignIcon, UsersIcon, GroupIcon, ActivityIcon, TrendingDownIcon } from 'lucide-react';
import type { User, Group } from '~/types/admin'; // Import types

export function SuperAdminDashboard() {
  // Get data from Zustand store
  const {
    users: storeUsers,
    groups: storeGroups,
    transactions: storeTransactions
  } = useStore(state => ({
      users: state.users,
      groups: state.groups,
      transactions: state.transactions,
  }));

  // Safeguard: Default to empty arrays if store values are undefined
  const users = storeUsers || [];
  const groups = storeGroups || [];
  // const transactions = storeTransactions || []; // Safeguard transactions if needed by child components directly using it

  // Calculations based on store data (now safely using empty arrays if data isn't loaded)
  const totalEssence = users.reduce((sum, user) => sum + user.balance, 0);
  const centralFineAccount = 5000; // Placeholder
  const totalUsers = users.length;
  const userRoleBreakdown = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalGroups = groups.length;

  const activeActivities = 15; // Placeholder
  const completedActivities = 25; // Placeholder
  const currentPeriodExpenses = 1250; // Placeholder

  return (
    <div className="space-y-6">
      {/* Top Section - Global Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <DashboardCard title="Total ESSENCE" value={totalEssence.toLocaleString()} icon={<DollarSignIcon className="h-6 w-6 text-green-500" />} />
        <DashboardCard title="Central Fine Account" value={centralFineAccount.toLocaleString()} icon={<DollarSignIcon className="h-6 w-6 text-red-500" />} />
        <DashboardCard title="Total Users" value={totalUsers.toString()} description={`SA: ${userRoleBreakdown['Super Admin'] || 0}, A: ${userRoleBreakdown['Admin'] || 0}, U: ${userRoleBreakdown['User'] || 0}`} icon={<UsersIcon className="h-6 w-6 text-blue-500" />} />
        <DashboardCard title="Total Groups" value={totalGroups.toString()} icon={<GroupIcon className="h-6 w-6 text-purple-500" />} />
        <DashboardCard title="Activities (Active/Comp.)" value={`${activeActivities}/${completedActivities}`} icon={<ActivityIcon className="h-6 w-6 text-yellow-500" />} />
        <DashboardCard title="Period Expenses" value={currentPeriodExpenses.toLocaleString()} icon={<TrendingDownIcon className="h-6 w-6 text-orange-500" />} />
      </div>

      {/* Middle Section - System Health Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Pass transactions if needed, ensure RecentTransactionsFeed handles potentially empty/undefined props or store state */}
          <RecentTransactionsFeed /* transactions={transactions} */ />
        </div>
        <div className="space-y-6">
          <RecentAdminActions />
          {/* Pass users if needed, ensure SuspendedUsersPanel handles potentially empty/undefined props or store state */}
          <SuspendedUsersPanel /* users={users} */ />
        </div>
      </div>

      {/* Admin Shortcuts */}
      <AdminShortcuts />
    </div>
  );
}
