import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StoreState } from './types';
import type { UserProfile, AdminUser } from '~/types/user';
import type { MarketplaceItem, PurchaseRecordWithBuyerDetails } from '~/types/market';
import type { GlobalNotification, RecentAdminAction } from '~/types/admin';

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // User state
        currentUser: null,
        setCurrentUser: (user) => set({ currentUser: user }),

        // Admin state
        adminUsers: [],
        setAdminUsers: (users) => set({ adminUsers: users }),
        
        // General App Data
        users: [], 
        setUsers: (users) => set({ users }),
        groups: [], 
        setGroups: (groups) => set({ groups }),
        transactions: [], 
        setTransactions: (transactions) => set({ transactions }),

        // Marketplace state
        marketplaceItems: [],
        setMarketplaceItems: (items) => set({ marketplaceItems: items }),
        addMarketplaceItem: (item) => set((state) => ({ marketplaceItems: [...state.marketplaceItems, item] })),
        updateMarketplaceItem: (item) => set((state) => ({
          marketplaceItems: state.marketplaceItems.map((i) => (i.id === item.id ? item : i)),
        })),
        removeMarketplaceItem: (itemId) => set((state) => ({
          marketplaceItems: state.marketplaceItems.filter((i) => i.id !== itemId),
        })),
        
        // Purchase records state
        purchaseRecords: [],
        setPurchaseRecords: (records) => set({ purchaseRecords: records }),
        addPurchaseRecord: (record) => set((state) => ({
          purchaseRecords: [record, ...state.purchaseRecords], // Prepend new record
        })),
        markPurchaseAsDelivered: (recordId: string) => set((state) => ({
          purchaseRecords: state.purchaseRecords.map(record =>
            record.id === recordId
              ? { ...record, status: 'delivered', deliveryDate: new Date().toISOString() }
              : record
          ),
        })),

        // Global Notifications
        notifications: [],
        addNotification: (notification) => {
          const newNotification: GlobalNotification = {
            ...notification,
            id: Date.now().toString() + Math.random().toString(36).substring(2,9),
            timestamp: new Date().toISOString(),
          };
          set((state) => ({ notifications: [newNotification, ...state.notifications.slice(0, 4)] }));
        },
        dismissNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
        clearNotifications: () => set({ notifications: [] }),

        // Recent Admin Actions
        recentActions: [], 
        setRecentActions: (actions) => set({ recentActions: actions }),
        addRecentAction: (actionInput) => {
          const newAction: RecentAdminAction = {
            ...actionInput,
            id: Date.now().toString() + Math.random().toString(36).substring(2,9),
            timestamp: new Date().toISOString(),
          };
          set((state) => ({ recentActions: [newAction, ...state.recentActions.slice(0, 19)] }));
        },
        
        // UI State
        isSidebarOpen: true,
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      }),
      {
        name: 'app-storage',
      }
    )
  )
);

export { useStore };
