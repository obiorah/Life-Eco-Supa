import type { MetaFunction } from "@remix-run/node";
import { useState, useMemo, useEffect } from "react";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Management" },
    { name: "description", content: "Manage the Life Economy system" },
  ];
};

// --- Icons ---

// Define missing icons
function CurrencyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}

function BehaviorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="m16 16-3-3-3 3" />
      <path d="m16 8 3 3-6 6" />
    </svg>
  );
}

function EconomyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PlusCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="16" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ThumbsUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function ThumbsDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

// Icons for Economy Management Actions
function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function ToggleLeftIcon(props: React.SVGProps<SVGSVGElement>) { // For Deactivate
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
      <circle cx="8" cy="12" r="3"></circle>
    </svg>
  );
}

function ToggleRightIcon(props: React.SVGProps<SVGSVGElement>) { // For Activate
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
      <circle cx="16" cy="12" r="3"></circle>
    </svg>
  );
}

function XCircleIcon(props: React.SVGProps<SVGSVGElement>) { // For Unassign
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) { // For Assign
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  );
}


// --- Types ---
type Tab = "currency" | "behavior" | "economy";
type BehaviorActionType = "reward" | "fine";
type TargetType = "user" | "group";
type Frequency = "One-time" | "Daily" | "Weekly" | "Monthly";
type EconomySubTab = "addActivity" | "addExpense" | "assignActivity" | "assignExpense";

interface IssuanceRecord {
  id: string;
  timestamp: Date; // Keep as Date object, but initialize statically
  amount: number;
  reason: string;
  issuedBy: string; // Placeholder for admin user
}

interface BehaviorRecord {
  id: string;
  timestamp: Date; // Keep as Date object
  actor: string; // Admin/Awarder/Finer
  target: string; // User/Group Name or ID
  targetType: TargetType;
  amount: number;
  reason: string;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  pay: number;
  frequency: Frequency;
  slots: number; // Renamed from 'slotsAvailable'
  createdDate: Date; // Keep as Date object, but initialize statically
  isActive: boolean; // For activate/deactivate
}

interface Expense {
  id: string;
  name: string;
  description: string;
  cost: number;
  frequency: Frequency;
  createdDate: Date; // Keep as Date object
  isActive: boolean; // For activate/deactivate
}

interface ActivityAssignment {
  id: string;
  targetId: string; // User or Group ID
  targetName: string; // User or Group Name
  targetType: TargetType;
  activityId: string;
  activityName: string;
  assignedDate: Date; // Keep as Date object
  assignedBy: string; // Admin username/ID
}

interface ExpenseAssignment {
  id: string;
  targetId: string; // User or Group ID
  targetName: string; // User or Group Name
  targetType: TargetType;
  expenseId: string;
  expenseName: string;
  assignedDate: Date; // Keep as Date object
  assignedBy: string; // Admin username/ID
}


// Mock Data (Replace with actual data fetching)
const MOCK_USERS = [
  { id: "user1", name: "Alice" },
  { id: "user2", name: "Bob" },
  { id: "user3", name: "Charlie" },
  { id: "user4", name: "Diana" },
];
const MOCK_GROUPS = [
  { id: "groupA", name: "Developers" },
  { id: "groupB", name: "Marketing" },
  { id: "groupC", name: "Support Team" },
];

// --- Currency Management Component ---
function CurrencyManagementTab() {
  // State for total balance (start with a mock value)
  const [totalEssence, setTotalEssence] = useState<number>(1000000);
  // State for issuance history (start with mock data using static dates)
  const [issuanceHistory, setIssuanceHistory] = useState<IssuanceRecord[]>([
    { id: "1", timestamp: new Date("2023-10-26T10:00:00Z"), amount: 500000, reason: "Initial Seed", issuedBy: "System" },
    { id: "2", timestamp: new Date("2023-10-27T11:30:00Z"), amount: 500000, reason: "Phase 1 Allocation", issuedBy: "Admin A" },
  ]);
  // State for minting form
  const [mintAmount, setMintAmount] = useState<string>("");
  const [mintReason, setMintReason] = useState<string>("");
  // State for history search filter
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleMintCurrency = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = parseFloat(mintAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive amount to mint.");
      return;
    }

    const newRecord: IssuanceRecord = {
      id: crypto.randomUUID(), // Simple unique ID for demo - OK in event handler
      timestamp: new Date(), // OK in event handler
      amount: amount,
      reason: mintReason || "Minted via console",
      issuedBy: "Current Admin", // Placeholder
    };

    setTotalEssence((prevTotal) => prevTotal + amount);
    setIssuanceHistory((prevHistory) => [newRecord, ...prevHistory]); // Add to top

    // Clear form
    setMintAmount("");
    setMintReason("");
  };

  const filteredHistory = useMemo(() => {
    if (!searchTerm) {
      return issuanceHistory;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return issuanceHistory.filter(
      (record) =>
        record.reason.toLowerCase().includes(lowerCaseSearch) ||
        record.issuedBy.toLowerCase().includes(lowerCaseSearch) ||
        record.amount.toString().includes(lowerCaseSearch) ||
        record.timestamp.toLocaleDateString().includes(lowerCaseSearch) ||
        record.timestamp.toLocaleTimeString().includes(lowerCaseSearch)
    );
  }, [issuanceHistory, searchTerm]);

  return (
    <div className="p-4 border rounded-b-md dark:border-gray-700 space-y-6">
      {/* 1. Total Balance Display */}
      <div className="bg-card dark:bg-card shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground">
          Total ESSENCE in Circulation
        </h3>
        <div className="mt-2 text-3xl font-bold text-primary dark:text-primary">
          {totalEssence.toLocaleString()} <span className="text-xl font-medium text-muted-foreground dark:text-muted-foreground">ESSENCE</span>
        </div>
      </div>

      {/* 2. Currency Minting Section */}
      <div className="bg-card dark:bg-card shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
          Mint New ESSENCE
        </h3>
        <form onSubmit={handleMintCurrency} className="space-y-4">
          <div>
            <label htmlFor="mintAmount" className="block text-sm font-medium text-foreground dark:text-foreground">
              Amount to Mint
            </label>
            <input
              type="number"
              id="mintAmount"
              name="mintAmount"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              required
              min="0.01" // Or adjust as needed
              step="any"
              className="input-style mt-1" // Use class from tailwind.css
              placeholder="e.g., 10000"
            />
          </div>
          <div>
            <label htmlFor="mintReason" className="block text-sm font-medium text-foreground dark:text-foreground">
              Reason / Description (Optional)
            </label>
            <input
              type="text"
              id="mintReason"
              name="mintReason"
              value={mintReason}
              onChange={(e) => setMintReason(e.target.value)}
              className="input-style mt-1" // Use class from tailwind.css
              placeholder="e.g., Monthly reward pool top-up"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary" // Use classes from tailwind.css
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Mint Currency
          </button>
        </form>
      </div>

      {/* 3. Issuance History Table */}
      <div className="bg-card dark:bg-card shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
          Issuance History
        </h3>
        {/* Search Input */}
        <div className="mb-4 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
           </div>
           <input
             type="text"
             placeholder="Search history (reason, amount, date...)"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="input-style block w-full pl-10 pr-3 py-2" // Use class
           />
         </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border dark:divide-border">
            <thead className="bg-muted/50 dark:bg-muted/50">
              <tr>
                <th scope="col" className="th-style"> {/* Use class */}
                  Date / Time
                </th>
                <th scope="col" className="th-style"> {/* Use class */}
                  Amount Issued
                </th>
                <th scope="col" className="th-style"> {/* Use class */}
                  Reason / Description
                </th>
                <th scope="col" className="th-style"> {/* Use class */}
                  Issued By
                </th>
              </tr>
            </thead>
            <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((record) => (
                  <tr key={record.id}>
                    <td className="td-style"> {/* Use class */}
                      {record.timestamp.toLocaleString()}
                    </td>
                    <td className="td-style font-medium"> {/* Use class */}
                      {record.amount.toLocaleString()}
                    </td>
                    <td className="td-style"> {/* Use class */}
                      {record.reason}
                    </td>
                    <td className="td-style"> {/* Use class */}
                      {record.issuedBy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                    {searchTerm ? "No matching records found." : "No issuance history yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Behavior Management Component ---
function BehaviorManagementTab() {
  // --- State ---
  const [actionType, setActionType] = useState<BehaviorActionType>("reward");
  const [targetType, setTargetType] = useState<TargetType>("user");
  const [selectedTarget, setSelectedTarget] = useState<string>(""); // Store ID or name
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [showNotification, setShowNotification] = useState<boolean>(false); // Notification state
  const [notificationMessage, setNotificationMessage] = useState<string>(""); // Notification message state

  // Mock history & fine account (replace with actual data/API calls)
  const [rewardHistory, setRewardHistory] = useState<BehaviorRecord[]>([]);
  const [fineHistory, setFineHistory] = useState<BehaviorRecord[]>([]);
  const [fineAccountBalance, setFineAccountBalance] = useState<number>(500); // Mock starting balance
  const [searchTermReward, setSearchTermReward] = useState<string>("");
  const [searchTermFine, setSearchTermFine] = useState<string>("");

  // --- Effects ---
  // Effect to hide notification after a delay
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage(""); // Clear message when hiding
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount or if shown again
    }
  }, [showNotification]);

  // --- Derived State / Memos ---
  const targetOptions = useMemo(() => {
    return targetType === "user" ? MOCK_USERS : MOCK_GROUPS;
  }, [targetType]);

  const filteredRewardHistory = useMemo(() => {
    if (!searchTermReward) return rewardHistory;
    const lowerSearch = searchTermReward.toLowerCase();
    return rewardHistory.filter(
      (r) =>
        r.actor.toLowerCase().includes(lowerSearch) ||
        r.target.toLowerCase().includes(lowerSearch) ||
        r.reason.toLowerCase().includes(lowerSearch) ||
        r.amount.toString().includes(lowerSearch) ||
        r.timestamp.toLocaleString().toLowerCase().includes(lowerSearch)
    );
  }, [rewardHistory, searchTermReward]);

  const filteredFineHistory = useMemo(() => {
    if (!searchTermFine) return fineHistory;
    const lowerSearch = searchTermFine.toLowerCase();
    return fineHistory.filter(
      (r) =>
        r.actor.toLowerCase().includes(lowerSearch) ||
        r.target.toLowerCase().includes(lowerSearch) ||
        r.reason.toLowerCase().includes(lowerSearch) ||
        r.amount.toString().includes(lowerSearch) ||
        r.timestamp.toLocaleString().toLowerCase().includes(lowerSearch)
    );
  }, [fineHistory, searchTermFine]);

  // --- Handlers ---
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    if (!selectedTarget) {
      alert(`Please select a ${targetType}.`);
      return;
    }
    if (!reason.trim()) {
      alert("Please provide a reason.");
      return;
    }

    const targetName = targetOptions.find(t => t.id === selectedTarget)?.name || selectedTarget; // Get name for display

    const newRecord: BehaviorRecord = {
      id: crypto.randomUUID(), // OK in event handler
      timestamp: new Date(), // OK in event handler
      actor: "Current Admin", // Placeholder
      target: targetName,
      targetType: targetType,
      amount: numericAmount,
      reason: reason,
    };

    let successMsg = "";
    if (actionType === "reward") {
      setRewardHistory((prev) => [newRecord, ...prev]);
      successMsg = `Successfully rewarded ${targetName} with ${numericAmount.toLocaleString()} ESSENCE.`;
      // TODO: Add actual reward logic (deduct from admin, add to target) via API call
      console.log("Mock Reward:", newRecord);
    } else { // Fine
      setFineHistory((prev) => [newRecord, ...prev]);
      setFineAccountBalance((prev) => prev + numericAmount); // Add to fine account
      successMsg = `Successfully fined ${targetName} ${numericAmount.toLocaleString()} ESSENCE.`;
      // TODO: Add actual fine logic (deduct from target) via API call
      console.log("Mock Fine:", newRecord);
    }

    // Show notification
    setNotificationMessage(successMsg);
    setShowNotification(true);

    // Clear form
    setSelectedTarget("");
    setAmount("");
    setReason("");
  };

  // --- Render ---
  // Placeholder for permission check
  const isAdmin = true; // Replace with actual permission logic
  if (!isAdmin) {
    return (
      <div className="p-4 border rounded-b-md dark:border-gray-700">
        <p className="text-destructive dark:text-destructive-foreground">Access Denied. You do not have permission to manage behavior.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-b-md dark:border-gray-700 space-y-6 relative"> {/* Added relative positioning for notification */}

      {/* Success Notification */}
      {showNotification && (
        <div
          className="fixed top-20 right-6 z-50 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-900 dark:text-green-300 shadow-lg border border-green-300 dark:border-green-600"
          role="alert"
        >
          <div className="flex items-center">
            <CheckCircleIcon className="flex-shrink-0 inline w-5 h-5 mr-3" />
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Fine Account Balance Display (Moved Here) */}
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 shadow rounded-lg p-4">
          <h3 className="text-sm font-medium leading-6 text-yellow-800 dark:text-yellow-300">
            Central Fine Account Balance
          </h3>
          <div className="mt-1 text-xl font-bold text-yellow-900 dark:text-yellow-200">
            {fineAccountBalance.toLocaleString()} <span className="text-base font-medium text-yellow-700 dark:text-yellow-400">ESSENCE</span>
          </div>
          <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">This balance increases when fines are issued.</p>
      </div>

      {/* Action Form Section */}
      <div className="bg-card dark:bg-card shadow rounded-lg p-6">
        {/* 1. Reward/Fine Toggle */}
        <div className="mb-6">
          <span className="text-lg font-medium text-card-foreground dark:text-card-foreground mr-4">Action:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActionType("reward")}
              className={cn(
                "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                actionType === "reward"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 z-10 ring-1 ring-green-500"
                  : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                "rounded-l-lg"
              )}
            >
              <ThumbsUpIcon className="-ml-1 mr-2 h-5 w-5" />
              Reward
            </button>
            <button
              type="button"
              onClick={() => setActionType("fine")}
              className={cn(
                "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                 actionType === "fine"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 z-10 ring-1 ring-red-500"
                  : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                 "rounded-r-md" // Adjusted for two buttons
              )}
            >
              <ThumbsDownIcon className="-ml-1 mr-2 h-5 w-5" />
              Fine
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 2. Target Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">Target Type</label>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => { setTargetType("user"); setSelectedTarget(""); }} // Reset selection on change
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                  targetType === "user"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500"
                    : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                  "rounded-l-lg"
                )}
              >
                <UserIcon className="-ml-1 mr-2 h-5 w-5" />
                Individual User
              </button>
              <button
                type="button"
                onClick={() => { setTargetType("group"); setSelectedTarget(""); }} // Reset selection on change
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                  targetType === "group"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500"
                    : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                  "rounded-r-md"
                )}
              >
                <UsersIcon className="-ml-1 mr-2 h-5 w-5" />
                Group
              </button>
            </div>
          </div>

          {/* 3. User/Group Selector */}
          <div>
            <label htmlFor="targetSelector" className="block text-sm font-medium text-foreground dark:text-foreground">
              Select {targetType === "user" ? "User" : "Group"}
            </label>
            {/* Basic Select - Replace with searchable dropdown component later */}
            <select
              id="targetSelector"
              name="targetSelector"
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              required
              className="input-style mt-1" // Use class
            >
              <option value="" disabled>-- Select a {targetType} --</option>
              {targetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
             <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">Note: This is a basic selector. A searchable dropdown will be implemented later.</p>
          </div>

          {/* 4. Amount */}
          <div>
            <label htmlFor="behaviorAmount" className="block text-sm font-medium text-foreground dark:text-foreground">
              Amount (ESSENCE)
            </label>
            <input
              type="number"
              id="behaviorAmount"
              name="behaviorAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="any"
              className="input-style mt-1" // Use class
              placeholder={`Amount to ${actionType}`}
            />
          </div>

          {/* 5. Reason */}
          <div>
            <label htmlFor="behaviorReason" className="block text-sm font-medium text-foreground dark:text-foreground">
              Reason
            </label>
            <textarea
              id="behaviorReason"
              name="behaviorReason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="input-style mt-1" // Use class
              placeholder={`Reason for the ${actionType}...`}
            />
          </div>

          {/* 6. Submit Button */}
          <button
            type="submit"
            className={cn(
              "btn", // Use base btn class
              actionType === 'reward'
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white" // Keep specific colors
                : "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white" // Keep specific colors
            )}
          >
            {actionType === 'reward' ? <ThumbsUpIcon className="-ml-1 mr-2 h-5 w-5" /> : <ThumbsDownIcon className="-ml-1 mr-2 h-5 w-5" />}
            {actionType === "reward" ? "Reward" : "Fine"} {targetType === "user" ? "User" : "Group"}
          </button>
        </form>
      </div>

      {/* History Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reward History Table */}
        <div className="bg-card dark:bg-card shadow rounded-lg p-6">
          <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
            Reward History
          </h3>
          {/* Search Input */}
          <div className="mb-4 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
             </div>
             <input
               type="text"
               placeholder="Search rewards..."
               value={searchTermReward}
               onChange={(e) => setSearchTermReward(e.target.value)}
               className="input-style block w-full pl-10 pr-3 py-2" // Use class
             />
           </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-border">
              <thead className="bg-muted/50 dark:bg-muted/50">
                <tr>
                  <th scope="col" className="th-style">Date</th> {/* Use class */}
                  <th scope="col" className="th-style">Awarder</th> {/* Use class */}
                  <th scope="col" className="th-style">Recipient</th> {/* Use class */}
                  <th scope="col" className="th-style">Amount</th> {/* Use class */}
                  <th scope="col" className="th-style">Reason</th> {/* Use class */}
                </tr>
              </thead>
              <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
                {filteredRewardHistory.length > 0 ? (
                  filteredRewardHistory.map((record) => (
                    <tr key={record.id}>
                      <td className="td-style text-muted-foreground">{record.timestamp.toLocaleString()}</td> {/* Use class */}
                      <td className="td-style">{record.actor}</td> {/* Use class */}
                      <td className="td-style">{record.target} ({record.targetType})</td> {/* Use class */}
                      <td className="td-style text-green-600 dark:text-green-400 font-medium">+{record.amount.toLocaleString()}</td> {/* Use class */}
                      <td className="td-style text-muted-foreground max-w-xs truncate" title={record.reason}>{record.reason}</td> {/* Use class */}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">{searchTermReward ? "No matching rewards found." : "No reward history yet."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fine History Table */}
        <div className="bg-card dark:bg-card shadow rounded-lg p-6">
          <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
            Fine History
          </h3>
           {/* Search Input */}
          <div className="mb-4 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
             </div>
             <input
               type="text"
               placeholder="Search fines..."
               value={searchTermFine}
               onChange={(e) => setSearchTermFine(e.target.value)}
               className="input-style block w-full pl-10 pr-3 py-2" // Use class
             />
           </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-border">
              <thead className="bg-muted/50 dark:bg-muted/50">
                <tr>
                  <th scope="col" className="th-style">Date</th> {/* Use class */}
                  <th scope="col" className="th-style">Admin</th> {/* Use class */}
                  <th scope="col" className="th-style">Fined Entity</th> {/* Use class */}
                  <th scope="col" className="th-style">Amount</th> {/* Use class */}
                  <th scope="col" className="th-style">Reason</th> {/* Use class */}
                </tr>
              </thead>
              <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
                 {filteredFineHistory.length > 0 ? (
                  filteredFineHistory.map((record) => (
                    <tr key={record.id}>
                      <td className="td-style text-muted-foreground">{record.timestamp.toLocaleString()}</td> {/* Use class */}
                      <td className="td-style">{record.actor}</td> {/* Use class */}
                      <td className="td-style">{record.target} ({record.targetType})</td> {/* Use class */}
                      <td className="td-style text-red-600 dark:text-red-400 font-medium">-{record.amount.toLocaleString()}</td> {/* Use class */}
                      <td className="td-style text-muted-foreground max-w-xs truncate" title={record.reason}>{record.reason}</td> {/* Use class */}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">{searchTermFine ? "No matching fines found." : "No fine history yet."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Economy Management Component ---
function EconomyManagementTab() {
  // --- State ---
  const [activeSubTab, setActiveSubTab] = useState<EconomySubTab>("addActivity");
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  // Mock Data (Replace with API calls - Use static dates)
  const [activities, setActivities] = useState<Activity[]>([
    { id: "act1", name: "Daily Standup Report", description: "Submit daily progress report.", pay: 50, frequency: "Daily", slots: 10, createdDate: new Date("2023-10-23T09:00:00Z"), isActive: true },
    { id: "act2", name: "Code Review", description: "Review a peer's pull request.", pay: 150, frequency: "One-time", slots: 5, createdDate: new Date("2023-10-25T14:00:00Z"), isActive: true },
    { id: "act3", name: "Weekly Planning", description: "Participate in weekly team planning.", pay: 200, frequency: "Weekly", slots: 15, createdDate: new Date("2023-10-21T10:00:00Z"), isActive: false },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    // Add some initial mock expenses if needed for testing
    { id: "exp1", name: "Monthly Software Subscription", description: "Fee for IDE license", cost: 200, frequency: "Monthly", createdDate: new Date("2023-11-01T00:00:00Z"), isActive: true },
    { id: "exp2", name: "Team Lunch Fund", description: "Contribution to weekly team lunch", cost: 50, frequency: "Weekly", createdDate: new Date("2023-10-28T12:00:00Z"), isActive: true },
    { id: "exp3", name: "Coffee Machine Maintenance", description: "Monthly upkeep", cost: 75, frequency: "Monthly", createdDate: new Date("2023-10-15T08:00:00Z"), isActive: false },
  ]);
  const [activityAssignments, setActivityAssignments] = useState<ActivityAssignment[]>([
    // Add mock assignment for testing table
    { id: "assignAct1", targetId: "user1", targetName: "Alice", targetType: "user", activityId: "act1", activityName: "Daily Standup Report", assignedDate: new Date("2023-11-05T10:00:00Z"), assignedBy: "Admin B" },
    { id: "assignAct2", targetId: "groupA", targetName: "Developers", targetType: "group", activityId: "act2", activityName: "Code Review", assignedDate: new Date("2023-11-06T11:00:00Z"), assignedBy: "Admin B" },
  ]);
  const [expenseAssignments, setExpenseAssignments] = useState<ExpenseAssignment[]>([
    // Add mock expense assignment for testing
    { id: "assignExp1", targetId: "user2", targetName: "Bob", targetType: "user", expenseId: "exp1", expenseName: "Monthly Software Subscription", assignedDate: new Date("2023-11-02T09:30:00Z"), assignedBy: "Admin A" },
    { id: "assignExp2", targetId: "groupA", targetName: "Developers", targetType: "group", expenseId: "exp2", expenseName: "Team Lunch Fund", assignedDate: new Date("2023-11-03T13:00:00Z"), assignedBy: "Admin A" },
  ]);

  // Form State - Add Activity
  const [activityName, setActivityName] = useState("");
  const [activityDesc, setActivityDesc] = useState("");
  const [activityPay, setActivityPay] = useState("");
  const [activityFreq, setActivityFreq] = useState<Frequency>("One-time");
  const [activitySlots, setActivitySlots] = useState("");

  // Form State - Add Expense
  const [expenseName, setExpenseName] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseCost, setExpenseCost] = useState("");
  const [expenseFreq, setExpenseFreq] = useState<Frequency>("One-time");

  // Form State - Assign Activity
  const [assignActivityTargetType, setAssignActivityTargetType] = useState<TargetType>("user");
  const [selectedAssignActivityTarget, setSelectedAssignActivityTarget] = useState<string>(""); // User/Group ID
  const [selectedActivityId, setSelectedActivityId] = useState<string>(""); // Activity ID

  // Form State - Assign Expense
  const [assignExpenseTargetType, setAssignExpenseTargetType] = useState<TargetType>("user");
  const [selectedAssignExpenseTarget, setSelectedAssignExpenseTarget] = useState<string>(""); // User/Group ID
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>(""); // Expense ID

  // Table State
  const [activitySearchTerm, setActivitySearchTerm] = useState("");
  const [expenseSearchTerm, setExpenseSearchTerm] = useState("");
  const [activityAssignmentSearchTerm, setActivityAssignmentSearchTerm] = useState("");
  const [expenseAssignmentSearchTerm, setExpenseAssignmentSearchTerm] = useState(""); // New search term for expense assignments

  // --- Effects ---
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // --- Handlers ---
  const handleShowNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  // Activity Handlers
  const handleAddActivity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pay = parseFloat(activityPay);
    const slots = parseInt(activitySlots, 10);

    if (!activityName.trim() || !activityDesc.trim()) {
        alert("Please fill in Activity Name and Description.");
        return;
    }
    if (isNaN(pay) || pay <= 0) {
        alert("Please enter a valid positive Pay amount.");
        return;
    }
     if (isNaN(slots) || slots <= 0) {
        alert("Please enter a valid positive number for Slots Available.");
        return;
    }

    const newActivity: Activity = {
        id: crypto.randomUUID(), // OK in event handler
        name: activityName.trim(),
        description: activityDesc.trim(),
        pay: pay,
        frequency: activityFreq,
        slots: slots,
        createdDate: new Date(), // OK in event handler
        isActive: true, // Default to active
    };

    setActivities(prev => [newActivity, ...prev]);
    handleShowNotification(`Activity '${newActivity.name}' created successfully.`);
    console.log(`[Admin Action] Activity Created: ${newActivity.name} by Current Admin`); // Logging Placeholder

    // Clear form
    setActivityName("");
    setActivityDesc("");
    setActivityPay("");
    setActivityFreq("One-time");
    setActivitySlots("");
  };

  const handleEditActivity = (id: string) => console.log("Edit Activity:", id); // Placeholder
  const handleDeleteActivity = (id: string) => {
    const activityToDelete = activities.find(act => act.id === id);
    if (!activityToDelete) return;

    if (window.confirm(`Are you sure you want to delete the activity '${activityToDelete.name}'? This cannot be undone.`)) {
        setActivities(prev => prev.filter(act => act.id !== id));
        // Also remove any assignments related to this activity
        setActivityAssignments(prev => prev.filter(assign => assign.activityId !== id));
        handleShowNotification(`Activity '${activityToDelete.name}' deleted and unassigned.`);
        console.log(`[Admin Action] Activity Deleted: ${activityToDelete.name} (ID: ${id}) by Current Admin`); // Logging Placeholder
    }
  };
  const handleToggleActivityStatus = (id: string) => {
    let activityName = "";
    let newStatus = false;
    setActivities(prev =>
        prev.map(act => {
            if (act.id === id) {
                activityName = act.name;
                newStatus = !act.isActive;
                return { ...act, isActive: newStatus };
            }
            return act;
        })
    );
    handleShowNotification(`Activity '${activityName}' status updated to ${newStatus ? 'Active' : 'Inactive'}.`);
    console.log(`[Admin Action] Activity Status Toggled: ${activityName} (ID: ${id}) to ${newStatus ? 'Active' : 'Inactive'} by Current Admin`); // Logging Placeholder
  };

  // Expense Handlers
  const handleAddExpense = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cost = parseFloat(expenseCost);

    if (!expenseName.trim() || !expenseDesc.trim()) {
        alert("Please fill in Expense Name and Description.");
        return;
    }
    if (isNaN(cost) || cost <= 0) {
        alert("Please enter a valid positive Cost amount.");
        return;
    }

    const newExpense: Expense = {
        id: crypto.randomUUID(), // OK in event handler
        name: expenseName.trim(),
        description: expenseDesc.trim(),
        cost: cost,
        frequency: expenseFreq,
        createdDate: new Date(), // OK in event handler
        isActive: true, // Default to active
    };

    setExpenses(prev => [newExpense, ...prev]);
    handleShowNotification(`Expense '${newExpense.name}' added successfully.`);
    console.log(`[Admin Action] Expense Created: ${newExpense.name} by Current Admin`); // Logging Placeholder

    // Clear form
    setExpenseName("");
    setExpenseDesc("");
    setExpenseCost("");
    setExpenseFreq("One-time");
  };

  const handleEditExpense = (id: string) => console.log("Edit Expense:", id); // Placeholder
  const handleDeleteExpense = (id: string) => {
     const expenseToDelete = expenses.find(exp => exp.id === id);
     if (!expenseToDelete) return;

     if (window.confirm(`Are you sure you want to delete the expense '${expenseToDelete.name}'? This cannot be undone.`)) {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
        // Also remove any assignments related to this expense
        setExpenseAssignments(prev => prev.filter(assign => assign.expenseId !== id));
        handleShowNotification(`Expense '${expenseToDelete.name}' deleted and unassigned.`);
        console.log(`[Admin Action] Expense Deleted: ${expenseToDelete.name} (ID: ${id}) by Current Admin`); // Logging Placeholder
    }
  };
  const handleToggleExpenseStatus = (id: string) => {
    let expenseName = "";
    let newStatus = false;
    setExpenses(prev =>
        prev.map(exp => {
            if (exp.id === id) {
                expenseName = exp.name;
                newStatus = !exp.isActive;
                return { ...exp, isActive: newStatus };
            }
            return exp;
        })
    );
    handleShowNotification(`Expense '${expenseName}' status updated to ${newStatus ? 'Active' : 'Inactive'}.`);
    console.log(`[Admin Action] Expense Status Toggled: ${expenseName} (ID: ${id}) to ${newStatus ? 'Active' : 'Inactive'} by Current Admin`); // Logging Placeholder
  };

  // Activity Assignment Handlers
  const handleAssignActivity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAssignActivityTarget) {
        alert(`Please select a ${assignActivityTargetType}.`);
        return;
    }
    if (!selectedActivityId) {
        alert("Please select an activity to assign.");
        return;
    }

    const targetList = assignActivityTargetType === 'user' ? MOCK_USERS : MOCK_GROUPS;
    const target = targetList.find(t => t.id === selectedAssignActivityTarget);
    const activity = activities.find(a => a.id === selectedActivityId);

    if (!target || !activity) {
        alert("Selected target or activity not found."); // Should not happen with proper dropdowns
        return;
    }

    // Check if this exact assignment already exists
    const alreadyAssigned = activityAssignments.some(
        assign => assign.targetId === target.id && assign.activityId === activity.id
    );
    if (alreadyAssigned) {
        alert(`${activity.name} is already assigned to ${target.name}.`);
        return;
    }

    const newAssignment: ActivityAssignment = {
        id: crypto.randomUUID(), // OK in event handler
        targetId: target.id,
        targetName: target.name,
        targetType: assignActivityTargetType,
        activityId: activity.id,
        activityName: activity.name,
        assignedDate: new Date(), // OK in event handler
        assignedBy: "Current Admin", // Placeholder
    };

    setActivityAssignments(prev => [newAssignment, ...prev]);
    handleShowNotification(`Activity '${activity.name}' assigned to ${target.name}.`);
    console.log(`[Admin Action] Activity Assigned: '${activity.name}' to ${target.name} (${assignActivityTargetType}) by Current Admin`); // Logging Placeholder

    // Clear form
    setSelectedAssignActivityTarget("");
    setSelectedActivityId("");
    // Keep assignActivityTargetType as is, user might want to assign more to the same type
  };

  const handleUnassignActivity = (assignmentId: string) => {
    const assignment = activityAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    if (window.confirm(`Are you sure you want to unassign '${assignment.activityName}' from '${assignment.targetName}'?`)) {
        setActivityAssignments(prev => prev.filter(a => a.id !== assignmentId));
        handleShowNotification("Activity unassigned successfully.");
        console.log(`[Admin Action] Activity Unassigned: '${assignment.activityName}' from ${assignment.targetName} (ID: ${assignmentId}) by Current Admin`); // Logging Placeholder
    }
  };

  // Expense Assignment Handlers (NEW)
  const handleAssignExpense = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAssignExpenseTarget) {
        alert(`Please select a ${assignExpenseTargetType}.`);
        return;
    }
    if (!selectedExpenseId) {
        alert("Please select an expense to assign.");
        return;
    }

    const targetList = assignExpenseTargetType === 'user' ? MOCK_USERS : MOCK_GROUPS;
    const target = targetList.find(t => t.id === selectedAssignExpenseTarget);
    const expense = expenses.find(e => e.id === selectedExpenseId);

    if (!target || !expense) {
        alert("Selected target or expense not found.");
        return;
    }

    // Check if this exact assignment already exists
    const alreadyAssigned = expenseAssignments.some(
        assign => assign.targetId === target.id && assign.expenseId === expense.id
    );
    if (alreadyAssigned) {
        alert(`${expense.name} is already assigned to ${target.name}.`);
        return;
    }

    const newAssignment: ExpenseAssignment = {
        id: crypto.randomUUID(), // OK in event handler
        targetId: target.id,
        targetName: target.name,
        targetType: assignExpenseTargetType,
        expenseId: expense.id,
        expenseName: expense.name,
        assignedDate: new Date(), // OK in event handler
        assignedBy: "Current Admin", // Placeholder
    };

    setExpenseAssignments(prev => [newAssignment, ...prev]);
    handleShowNotification(`Expense '${expense.name}' assigned to ${target.name}.`);
    console.log(`[Admin Action] Expense Assigned: '${expense.name}' to ${target.name} (${assignExpenseTargetType}) by Current Admin`); // Logging Placeholder

    // Clear form
    setSelectedAssignExpenseTarget("");
    setSelectedExpenseId("");
    // Keep assignExpenseTargetType as is
  };

  const handleUnassignExpense = (assignmentId: string) => {
    const assignment = expenseAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    if (window.confirm(`Are you sure you want to unassign '${assignment.expenseName}' from '${assignment.targetName}'?`)) {
        setExpenseAssignments(prev => prev.filter(a => a.id !== assignmentId));
        handleShowNotification("Expense unassigned successfully.");
        console.log(`[Admin Action] Expense Unassigned: '${assignment.expenseName}' from ${assignment.targetName} (ID: ${assignmentId}) by Current Admin`); // Logging Placeholder
    }
  };


  // --- Filtering & Derived Data ---
  const filteredActivities = useMemo(() => {
    if (!activitySearchTerm) return activities;
    const lowerSearch = activitySearchTerm.toLowerCase();
    return activities.filter(act =>
        act.name.toLowerCase().includes(lowerSearch) ||
        act.description.toLowerCase().includes(lowerSearch) ||
        act.pay.toString().includes(lowerSearch) ||
        act.frequency.toLowerCase().includes(lowerSearch) ||
        act.slots.toString().includes(lowerSearch) ||
        act.createdDate.toLocaleDateString().includes(lowerSearch)
    );
  }, [activities, activitySearchTerm]);

  const filteredExpenses = useMemo(() => {
    if (!expenseSearchTerm) return expenses;
    const lowerSearch = expenseSearchTerm.toLowerCase();
    return expenses.filter(exp =>
        exp.name.toLowerCase().includes(lowerSearch) ||
        exp.description.toLowerCase().includes(lowerSearch) ||
        exp.cost.toString().includes(lowerSearch) ||
        exp.frequency.toLowerCase().includes(lowerSearch) ||
        exp.createdDate.toLocaleDateString().includes(lowerSearch)
    );
  }, [expenses, expenseSearchTerm]);

  // Options for Assign Activity form
  const assignActivityTargetOptions = useMemo(() => {
    return assignActivityTargetType === "user" ? MOCK_USERS : MOCK_GROUPS;
  }, [assignActivityTargetType]);

  const activeActivities = useMemo(() => {
    return activities.filter(act => act.isActive);
  }, [activities]);

  const filteredActivityAssignments = useMemo(() => {
    if (!activityAssignmentSearchTerm) return activityAssignments;
    const lowerSearch = activityAssignmentSearchTerm.toLowerCase();
    return activityAssignments.filter(assign =>
        assign.targetName.toLowerCase().includes(lowerSearch) ||
        assign.activityName.toLowerCase().includes(lowerSearch) ||
        assign.assignedBy.toLowerCase().includes(lowerSearch) ||
        assign.assignedDate.toLocaleString().toLowerCase().includes(lowerSearch) ||
        assign.targetType.toLowerCase().includes(lowerSearch)
    );
  }, [activityAssignments, activityAssignmentSearchTerm]);

  // Options for Assign Expense form (NEW)
  const assignExpenseTargetOptions = useMemo(() => {
    return assignExpenseTargetType === "user" ? MOCK_USERS : MOCK_GROUPS;
  }, [assignExpenseTargetType]);

  const activeExpenses = useMemo(() => {
    return expenses.filter(exp => exp.isActive);
  }, [expenses]);

  const filteredExpenseAssignments = useMemo(() => {
    if (!expenseAssignmentSearchTerm) return expenseAssignments;
    const lowerSearch = expenseAssignmentSearchTerm.toLowerCase();
    return expenseAssignments.filter(assign =>
        assign.targetName.toLowerCase().includes(lowerSearch) ||
        assign.expenseName.toLowerCase().includes(lowerSearch) ||
        assign.assignedBy.toLowerCase().includes(lowerSearch) ||
        assign.assignedDate.toLocaleString().toLowerCase().includes(lowerSearch) ||
        assign.targetType.toLowerCase().includes(lowerSearch)
    );
  }, [expenseAssignments, expenseAssignmentSearchTerm]);


  // --- Render Logic ---
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "addActivity":
        return (
          <div className="space-y-6">
            {/* Add Activity Form */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Create New Activity
              </h3>
              <form onSubmit={handleAddActivity} className="space-y-4">
                {/* Form Fields */}
                <div>
                  <label htmlFor="activityName" className="block text-sm font-medium text-foreground dark:text-foreground">Activity Name</label>
                  <input type="text" id="activityName" value={activityName} onChange={e => setActivityName(e.target.value)} required className="mt-1 block w-full input-style" />
                </div>
                <div>
                  <label htmlFor="activityDesc" className="block text-sm font-medium text-foreground dark:text-foreground">Description</label>
                  <textarea id="activityDesc" value={activityDesc} onChange={e => setActivityDesc(e.target.value)} required rows={3} className="mt-1 block w-full input-style" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="activityPay" className="block text-sm font-medium text-foreground dark:text-foreground">Pay (ESSENCE)</label>
                        <input type="number" id="activityPay" value={activityPay} onChange={e => setActivityPay(e.target.value)} required min="0.01" step="any" className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="activityFreq" className="block text-sm font-medium text-foreground dark:text-foreground">Payment Frequency</label>
                        <select id="activityFreq" value={activityFreq} onChange={e => setActivityFreq(e.target.value as Frequency)} required className="mt-1 block w-full input-style">
                            <option value="One-time">One-time</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="activitySlots" className="block text-sm font-medium text-foreground dark:text-foreground">Slots Available</label>
                        <input type="number" id="activitySlots" value={activitySlots} onChange={e => setActivitySlots(e.target.value)} required min="1" step="1" className="mt-1 block w-full input-style" />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" /> Add Activity
                </button>
              </form>
            </div>

            {/* Activities Table */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Existing Activities
              </h3>
              {/* Search Input */}
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={activitySearchTerm}
                  onChange={(e) => setActivitySearchTerm(e.target.value)}
                  className="input-style block w-full pl-10 pr-3 py-2" // Use class
                />
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border dark:divide-border">
                  <thead className="bg-muted/50 dark:bg-muted/50">
                    <tr>
                      <th className="th-style">Name</th>
                      <th className="th-style">Description</th>
                      <th className="th-style text-right">Pay</th>
                      <th className="th-style">Frequency</th>
                      <th className="th-style text-center">Slots</th>
                      <th className="th-style">Created</th>
                      <th className="th-style text-center">Status</th>
                      <th className="th-style text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((act) => (
                        <tr key={act.id}>
                          <td className="td-style font-medium">{act.name}</td>
                          <td className="td-style max-w-sm truncate" title={act.description}>{act.description}</td>
                          <td className="td-style text-right">{act.pay.toLocaleString()}</td>
                          <td className="td-style">{act.frequency}</td>
                          <td className="td-style text-center">{act.slots}</td>
                          <td className="td-style">{act.createdDate.toLocaleDateString()}</td>
                          <td className="td-style text-center">
                             <span className={cn(
                                "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                act.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                             )}>
                               {act.isActive ? "Active" : "Inactive"}
                             </span>
                          </td>
                          <td className="td-style text-center">
                            <div className="flex justify-center items-center space-x-2">
                               <button onClick={() => handleEditActivity(act.id)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit">
                                 <EditIcon className="h-4 w-4" />
                               </button>
                               <button onClick={() => handleToggleActivityStatus(act.id)} className={cn("hover:text-opacity-80", act.isActive ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400")} title={act.isActive ? "Deactivate" : "Activate"}>
                                 {act.isActive ? <ToggleLeftIcon className="h-4 w-4" /> : <ToggleRightIcon className="h-4 w-4" />}
                               </button>
                               <button onClick={() => handleDeleteActivity(act.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                 <Trash2Icon className="h-4 w-4" />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-muted-foreground">
                          {activitySearchTerm ? "No matching activities found." : "No activities created yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "addExpense":
        return (
          <div className="space-y-6">
            {/* Add Expense Form */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Define New Expense
              </h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                {/* Form Fields */}
                <div>
                  <label htmlFor="expenseName" className="block text-sm font-medium text-foreground dark:text-foreground">Expense Name</label>
                  <input type="text" id="expenseName" value={expenseName} onChange={e => setExpenseName(e.target.value)} required className="mt-1 block w-full input-style" />
                </div>
                <div>
                  <label htmlFor="expenseDesc" className="block text-sm font-medium text-foreground dark:text-foreground">Description</label>
                  <textarea id="expenseDesc" value={expenseDesc} onChange={e => setExpenseDesc(e.target.value)} required rows={3} className="mt-1 block w-full input-style" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expenseCost" className="block text-sm font-medium text-foreground dark:text-foreground">Cost (ESSENCE)</label>
                        <input type="number" id="expenseCost" value={expenseCost} onChange={e => setExpenseCost(e.target.value)} required min="0.01" step="any" className="mt-1 block w-full input-style" />
                    </div>
                    <div>
                        <label htmlFor="expenseFreq" className="block text-sm font-medium text-foreground dark:text-foreground">Expense Frequency</label>
                        <select id="expenseFreq" value={expenseFreq} onChange={e => setExpenseFreq(e.target.value as Frequency)} required className="mt-1 block w-full input-style">
                            <option value="One-time">One-time</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" /> Add Expense
                </button>
              </form>
            </div>

            {/* Expenses Table */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Existing Expenses
              </h3>
              {/* Search Input */}
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={expenseSearchTerm}
                  onChange={(e) => setExpenseSearchTerm(e.target.value)}
                  className="input-style block w-full pl-10 pr-3 py-2" // Use class
                />
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border dark:divide-border">
                  <thead className="bg-muted/50 dark:bg-muted/50">
                    <tr>
                      <th className="th-style">Name</th>
                      <th className="th-style">Description</th>
                      <th className="th-style text-right">Cost</th>
                      <th className="th-style">Frequency</th>
                      <th className="th-style">Created</th>
                      <th className="th-style text-center">Status</th>
                      <th className="th-style text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((exp) => (
                        <tr key={exp.id}>
                          <td className="td-style font-medium">{exp.name}</td>
                          <td className="td-style max-w-sm truncate" title={exp.description}>{exp.description}</td>
                          <td className="td-style text-right text-red-600 dark:text-red-400">{exp.cost.toLocaleString()}</td>
                          <td className="td-style">{exp.frequency}</td>
                          <td className="td-style">{exp.createdDate.toLocaleDateString()}</td>
                          <td className="td-style text-center">
                             <span className={cn(
                                "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                exp.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                             )}>
                               {exp.isActive ? "Active" : "Inactive"}
                             </span>
                          </td>
                          <td className="td-style text-center">
                            <div className="flex justify-center items-center space-x-2">
                               <button onClick={() => handleEditExpense(exp.id)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit">
                                 <EditIcon className="h-4 w-4" />
                               </button>
                               <button onClick={() => handleToggleExpenseStatus(exp.id)} className={cn("hover:text-opacity-80", exp.isActive ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400")} title={exp.isActive ? "Deactivate" : "Activate"}>
                                 {exp.isActive ? <ToggleLeftIcon className="h-4 w-4" /> : <ToggleRightIcon className="h-4 w-4" />}
                               </button>
                               <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                 <Trash2Icon className="h-4 w-4" />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-muted-foreground">
                          {expenseSearchTerm ? "No matching expenses found." : "No expenses defined yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "assignActivity":
        return (
          <div className="space-y-6">
            {/* Assign Activity Form */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Assign Activity
              </h3>
              <form onSubmit={handleAssignActivity} className="space-y-4">
                {/* Target Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">Assign To</label>
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => { setAssignActivityTargetType("user"); setSelectedAssignActivityTarget(""); }} // Reset selection
                      className={cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignActivityTargetType === "user"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500"
                          : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-l-lg"
                      )}
                    >
                      <UserIcon className="-ml-1 mr-2 h-5 w-5" />
                      Individual User
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAssignActivityTargetType("group"); setSelectedAssignActivityTarget(""); }} // Reset selection
                      className={cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignActivityTargetType === "group"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500"
                          : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-r-md"
                      )}
                    >
                      <UsersIcon className="-ml-1 mr-2 h-5 w-5" />
                      Group
                    </button>
                  </div>
                </div>

                {/* User/Group Selector */}
                <div>
                  <label htmlFor="assignActivityTargetSelector" className="block text-sm font-medium text-foreground dark:text-foreground">
                    Select {assignActivityTargetType === "user" ? "User" : "Group"}
                  </label>
                  {/* Basic Select - Replace with searchable dropdown component later */}
                  <select
                    id="assignActivityTargetSelector"
                    name="assignActivityTargetSelector"
                    value={selectedAssignActivityTarget}
                    onChange={(e) => setSelectedAssignActivityTarget(e.target.value)}
                    required
                    className="input-style mt-1"
                  >
                    <option value="" disabled>-- Select a {assignActivityTargetType} --</option>
                    {assignActivityTargetOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">Note: This is a basic selector. A searchable dropdown will be implemented later.</p>
                </div>

                {/* Activity Selector */}
                <div>
                  <label htmlFor="assignActivitySelector" className="block text-sm font-medium text-foreground dark:text-foreground">
                    Select Activity
                  </label>
                  <select
                    id="assignActivitySelector"
                    name="assignActivitySelector"
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    required
                    className="input-style mt-1"
                  >
                    <option value="" disabled>-- Select an active activity --</option>
                    {activeActivities.length > 0 ? (
                      activeActivities.map((activity) => (
                        <option key={activity.id} value={activity.id}>
                          {activity.name} (Pay: {activity.pay}, Freq: {activity.frequency})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No active activities available</option>
                    )}
                  </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">
                  <LinkIcon className="-ml-1 mr-2 h-5 w-5" /> Assign Activity
                </button>
              </form>
            </div>

            {/* Activity Assignments Table */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Current Activity Assignments
              </h3>
              {/* Search Input */}
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search assignments (user, group, activity...)"
                  value={activityAssignmentSearchTerm}
                  onChange={(e) => setActivityAssignmentSearchTerm(e.target.value)}
                  className="input-style block w-full pl-10 pr-3 py-2"
                />
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border dark:divide-border">
                  <thead className="bg-muted/50 dark:bg-muted/50">
                    <tr>
                      <th className="th-style">User/Group Name</th>
                      <th className="th-style">Activity Name</th>
                      <th className="th-style">Assigned Date</th>
                      <th className="th-style">Assigned By</th>
                      <th className="th-style text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
                    {filteredActivityAssignments.length > 0 ? (
                      filteredActivityAssignments.map((assign) => (
                        <tr key={assign.id}>
                          <td className="td-style font-medium">{assign.targetName} ({assign.targetType})</td>
                          <td className="td-style">{assign.activityName}</td>
                          <td className="td-style">{assign.assignedDate.toLocaleString()}</td>
                          <td className="td-style">{assign.assignedBy}</td>
                          <td className="td-style text-center">
                            <button
                              onClick={() => handleUnassignActivity(assign.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                              title="Unassign"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" /> Unassign
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">
                          {activityAssignmentSearchTerm ? "No matching assignments found." : "No activities assigned yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "assignExpense": // NEW SECTION
        return (
          <div className="space-y-6">
            {/* Assign Expense Form */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Assign Expense
              </h3>
              <form onSubmit={handleAssignExpense} className="space-y-4">
                {/* Target Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">Assign To</label>
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => { setAssignExpenseTargetType("user"); setSelectedAssignExpenseTarget(""); }} // Reset selection
                      className={cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignExpenseTargetType === "user"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500"
                          : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-l-lg"
                      )}
                    >
                      <UserIcon className="-ml-1 mr-2 h-5 w-5" />
                      Individual User
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAssignExpenseTargetType("group"); setSelectedAssignExpenseTarget(""); }} // Reset selection
                      className={cn(
                        "inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r border-input dark:border-input focus:z-10 focus:ring-2 focus:ring-ring focus:border-primary dark:focus:ring-offset-background",
                        assignExpenseTargetType === "group"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 z-10 ring-1 ring-blue-500"
                          : "bg-background text-foreground hover:bg-muted/50 dark:bg-background dark:text-foreground dark:hover:bg-muted/50",
                        "rounded-r-md"
                      )}
                    >
                      <UsersIcon className="-ml-1 mr-2 h-5 w-5" />
                      Group
                    </button>
                  </div>
                </div>

                {/* User/Group Selector */}
                <div>
                  <label htmlFor="assignExpenseTargetSelector" className="block text-sm font-medium text-foreground dark:text-foreground">
                    Select {assignExpenseTargetType === "user" ? "User" : "Group"}
                  </label>
                  {/* Basic Select - Replace with searchable dropdown component later */}
                  <select
                    id="assignExpenseTargetSelector"
                    name="assignExpenseTargetSelector"
                    value={selectedAssignExpenseTarget}
                    onChange={(e) => setSelectedAssignExpenseTarget(e.target.value)}
                    required
                    className="input-style mt-1"
                  >
                    <option value="" disabled>-- Select a {assignExpenseTargetType} --</option>
                    {assignExpenseTargetOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">Note: This is a basic selector. A searchable dropdown will be implemented later.</p>
                </div>

                {/* Expense Selector */}
                <div>
                  <label htmlFor="assignExpenseSelector" className="block text-sm font-medium text-foreground dark:text-foreground">
                    Select Expense
                  </label>
                  <select
                    id="assignExpenseSelector"
                    name="assignExpenseSelector"
                    value={selectedExpenseId}
                    onChange={(e) => setSelectedExpenseId(e.target.value)}
                    required
                    className="input-style mt-1"
                  >
                    <option value="" disabled>-- Select an active expense --</option>
                    {activeExpenses.length > 0 ? (
                      activeExpenses.map((expense) => (
                        <option key={expense.id} value={expense.id}>
                          {expense.name} (Cost: {expense.cost}, Freq: {expense.frequency})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No active expenses available</option>
                    )}
                  </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">
                  <LinkIcon className="-ml-1 mr-2 h-5 w-5" /> Assign Expense
                </button>
              </form>
            </div>

            {/* Expense Assignments Table */}
            <div className="bg-card dark:bg-card shadow rounded-lg p-6">
              <h3 className="text-lg font-medium leading-6 text-card-foreground dark:text-card-foreground mb-4">
                Current Expense Assignments
              </h3>
              {/* Search Input */}
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search assignments (user, group, expense...)"
                  value={expenseAssignmentSearchTerm}
                  onChange={(e) => setExpenseAssignmentSearchTerm(e.target.value)}
                  className="input-style block w-full pl-10 pr-3 py-2"
                />
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border dark:divide-border">
                  <thead className="bg-muted/50 dark:bg-muted/50">
                    <tr>
                      <th className="th-style">User/Group Name</th>
                      <th className="th-style">Expense Name</th>
                      <th className="th-style">Assigned Date</th>
                      <th className="th-style">Assigned By</th>
                      <th className="th-style text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
                    {filteredExpenseAssignments.length > 0 ? (
                      filteredExpenseAssignments.map((assign) => (
                        <tr key={assign.id}>
                          <td className="td-style font-medium">{assign.targetName} ({assign.targetType})</td>
                          <td className="td-style">{assign.expenseName}</td>
                          <td className="td-style">{assign.assignedDate.toLocaleString()}</td>
                          <td className="td-style">{assign.assignedBy}</td>
                          <td className="td-style text-center">
                            <button
                              onClick={() => handleUnassignExpense(assign.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                              title="Unassign"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" /> Unassign
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted-foreground">
                          {expenseAssignmentSearchTerm ? "No matching assignments found." : "No expenses assigned yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Placeholder for permission check
  const isAdmin = true; // Replace with actual permission logic
  if (!isAdmin) {
    return (
      <div className="p-4 border rounded-b-md dark:border-gray-700">
        <p className="text-destructive dark:text-destructive-foreground">Access Denied. You do not have permission to manage the economy.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-b-md dark:border-gray-700 space-y-6 relative">
       {/* Success Notification */}
       {showNotification && (
        <div
          className="fixed top-20 right-6 z-50 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-900 dark:text-green-300 shadow-lg border border-green-300 dark:border-green-600"
          role="alert"
        >
          <div className="flex items-center">
            <CheckCircleIcon className="flex-shrink-0 inline w-5 h-5 mr-3" />
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="border-b border-border dark:border-border">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveSubTab("addActivity")}
            className={cn(
              "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
              activeSubTab === "addActivity"
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
            )}
          >
            Add Activity
          </button>
          <button
            onClick={() => setActiveSubTab("addExpense")}
            className={cn(
              "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
              activeSubTab === "addExpense"
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
            )}
          >
            Add Expense
          </button>
          <button
            onClick={() => setActiveSubTab("assignActivity")}
            className={cn(
              "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
              activeSubTab === "assignActivity"
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
            )}
          >
            Assign Activity
          </button>
           <button
            onClick={() => setActiveSubTab("assignExpense")}
            className={cn(
              "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm",
              activeSubTab === "assignExpense"
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
            )}
          >
            Assign Expense
          </button>
        </nav>
      </div>

      {/* Sub-tab Content */}
      <div className="mt-4">
        {renderSubTabContent()}
      </div>
    </div>
  );
}


// --- Main Management Component ---
export default function Management() {
  const [activeTab, setActiveTab] = useState<Tab>("currency");

  // Client-side only state to prevent hydration mismatch for initial tab
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  const renderContent = () => {
    // Avoid rendering tab content on the server or before hydration,
    // especially if initial state relies on potentially mismatched values.
    // Or, ensure initial state is *always* identical server/client.
    // For now, let's delay rendering content until client-side mount.
    if (!isClient) {
       // Optionally return a placeholder or null during SSR/hydration phase
       // This helps if the initial state calculation is complex or differs.
       // However, fixing the initial state (like we did with dates) is the better approach.
       // We keep this `isClient` check as an extra safety measure for now.
       return null;
    }

    switch (activeTab) {
      case "currency":
        return <CurrencyManagementTab />;
      case "behavior":
        return <BehaviorManagementTab />;
      case "economy":
        return <EconomyManagementTab />; // Use the new component
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6">Management Console</h1>

      <div className="flex border-b border-border dark:border-border">
        <button
          onClick={() => setActiveTab("currency")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "currency"
              ? "border-primary text-primary dark:border-primary dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          )}
        >
          <CurrencyIcon className="h-5 w-5" />
          Currency
        </button>
        <button
          onClick={() => setActiveTab("behavior")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "behavior"
              ? "border-primary text-primary dark:border-primary dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          )}
        >
          <BehaviorIcon className="h-5 w-5" />
          Behavior
        </button>
        <button
          onClick={() => setActiveTab("economy")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "economy"
              ? "border-primary text-primary dark:border-primary dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border dark:hover:text-foreground dark:hover:border-border"
          )}
        >
          <EconomyIcon className="h-5 w-5" />
          Economy
        </button>
      </div>

      <div className="mt-0"> {/* Content area below tabs */}
        {renderContent()}
      </div>
    </div>
  );
}
