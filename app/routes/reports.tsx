import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { useUserRole } from "~/hooks/useUserRole";
import { AccessDenied } from "~/components/AccessDenied";
import { EconomyReportsTab } from "~/components/reports/EconomyReportsTab";
import { UserGroupReportsTab } from "~/components/reports/UserGroupReportsTab";
import { ActivityExpenseReportsTab } from "~/components/reports/ActivityExpenseReportsTab";
import { BehavioralReportsTab } from "~/components/reports/BehavioralReportsTab";
import { AdministrativeReportsTab } from "~/components/reports/AdministrativeReportsTab";
import { SecurityLogTabContent } from "~/components/reports/SecurityLogTabContent"; // Import the new component
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Reports" },
    { name: "description", content: "View system reports." },
  ];
};

type ReportTab =
  | "economy"
  | "userGroup"
  | "activityExpense"
  | "behavioral"
  | "administrative"
  | "securityLog"; // Add securityLog tab type

export default function ReportsPage() {
  const userRole = useUserRole();
  const [activeTab, setActiveTab] = useState<ReportTab>("economy");

  const isSuperAdmin = userRole === 'Super Admin';
  const isAdminOrSuperAdmin = userRole === 'Admin' || isSuperAdmin;

  // Role-based access control for the entire page
  if (!isAdminOrSuperAdmin) {
    return <AccessDenied requiredRole="Admin or Super Admin" />;
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "economy":
        return <EconomyReportsTab />;
      case "userGroup":
        return <UserGroupReportsTab />;
      case "activityExpense":
        return <ActivityExpenseReportsTab />;
      case "behavioral":
        return <BehavioralReportsTab />;
      case "administrative":
        // Only Super Admins can see this tab's content
        return isSuperAdmin ? <AdministrativeReportsTab /> : <AccessDenied requiredRole="Super Admin" />;
      case "securityLog": // Render the new component
        // Assuming Admins and Super Admins can see the security log
        return isAdminOrSuperAdmin ? <SecurityLogTabContent /> : <AccessDenied requiredRole="Admin or Super Admin" />;
      default:
        return null;
    }
  };

  const getTabClass = (tabName: ReportTab) =>
    cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
      activeTab === tabName
        ? "bg-background text-foreground shadow-sm"
        : "hover:bg-accent hover:text-accent-foreground"
    );


  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Reports</h1>

      {/* Placeholder Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="date-range" className="mb-1 block text-sm font-medium">Date Range</label>
          <input type="text" id="date-range" placeholder="Select dates..." className="input input-bordered w-full" /> {/* Replace with actual date picker */}
        </div>
        <div>
          <label htmlFor="user-filter" className="mb-1 block text-sm font-medium">User</label>
          <input type="text" id="user-filter" placeholder="Filter by user..." className="input input-bordered w-full" /> {/* Replace with user selector */}
        </div>
        <div>
          <label htmlFor="group-filter" className="mb-1 block text-sm font-medium">Group</label>
          <input type="text" id="group-filter" placeholder="Filter by group..." className="input input-bordered w-full" /> {/* Replace with group selector */}
        </div>
        <div>
          <label htmlFor="role-filter" className="mb-1 block text-sm font-medium">Role</label>
          <input type="text" id="role-filter" placeholder="Filter by role..." className="input input-bordered w-full" /> {/* Replace with role selector */}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap space-x-1 rounded-md bg-muted p-1 text-muted-foreground">
        <button className={getTabClass("economy")} onClick={() => setActiveTab("economy")}>
          💰 Economy
        </button>
        <button className={getTabClass("userGroup")} onClick={() => setActiveTab("userGroup")}>
          👥 User &amp; Group
        </button>
        <button className={getTabClass("activityExpense")} onClick={() => setActiveTab("activityExpense")}>
          🎯 Activity &amp; Expense
        </button>
        <button className={getTabClass("behavioral")} onClick={() => setActiveTab("behavioral")}>
          📈 Behavioral
        </button>
        {/* Conditionally render Administrative tab */}
        {isSuperAdmin && (
          <button className={getTabClass("administrative")} onClick={() => setActiveTab("administrative")}>
            🔧 Administrative
          </button>
        )}
        {/* Conditionally render Security Log tab (Admins & Super Admins) */}
        {isAdminOrSuperAdmin && (
           <button className={getTabClass("securityLog")} onClick={() => setActiveTab("securityLog")}>
             🛡️ Security Log
           </button>
        )}
      </div>

      {/* Tab Content Area */}
      <div className="mt-4">
        {renderActiveTabContent()}
      </div>

      {/* Placeholder Export/Schedule Buttons (Could be moved inside tabs later) */}
       <div className="mt-6 flex flex-wrap gap-2">
         <button className="btn btn-outline btn-sm">Export PDF</button>
         <button className="btn btn-outline btn-sm">Export CSV</button>
         <button className="btn btn-outline btn-sm">Export JSON</button>
         <button className="btn btn-secondary btn-sm">Schedule Export</button>
       </div>
    </div>
  );
}
