import type { UserProfile, AdminUser } from '~/types/user';
import type { MarketplaceItem, PurchaseRecordWithBuyerDetails } from '~/types/market';
import type { GlobalNotification, User, Group, RecentAdminAction } from '~/types/admin';

export interface StoreState {
  // User state
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;

  // Admin state
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[]) => void;

  // General App Data
  users: User[];
  setUsers: (users: User[]) => void;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  transactions: any[]; // TODO: Define a proper Transaction type
  setTransactions: (transactions: any[]) => void;

  // Marketplace state
  marketplaceItems: MarketplaceItem[];
  setMarketplaceItems: (items: MarketplaceItem[]) => void;
  addMarketplaceItem: (item: MarketplaceItem) => void;
  updateMarketplaceItem: (item: MarketplaceItem) => void;
  removeMarketplaceItem: (itemId: string) => void;
  
  // Purchase records state
  purchaseRecords: PurchaseRecordWithBuyerDetails[];
  setPurchaseRecords: (records: PurchaseRecordWithBuyerDetails[]) => void;
  addPurchaseRecord: (record: PurchaseRecordWithBuyerDetails) => void;
  markPurchaseAsDelivered: (recordId: string) => void; // Added

  // Global Notifications
  notifications: GlobalNotification[];
  addNotification: (notification: Omit<GlobalNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Recent Admin Actions
  recentActions: RecentAdminAction[];
  setRecentActions: (actions: RecentAdminAction[]) => void;
  addRecentAction: (actionInput: Omit<RecentAdminAction, 'id' | 'timestamp'>) => void;

  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}
