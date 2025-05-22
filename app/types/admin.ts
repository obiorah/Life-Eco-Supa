import type { UserProfile } from '~/types/user';

export interface User {
  id: string;
  email: string;
  fullName: string;
  balance: number;
  role: UserRole;
  createdAt: string; // YYYY-MM-DD
  status: 'active' | 'suspended' | 'pending';
  groupId?: string;
  groupName?: string; // Denormalized for convenience
  avatarUrl?: string;
}

export type UserRole = 'Super Admin' | 'Admin' | 'User';

export interface Group {
  id: string;
  name: string;
  leaderId: string;
  memberCount: number;
  // other group-specific fields
}

export interface GlobalNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string; // ISO string
  link?: string; // Optional link for more details
  isRead?: boolean; // Optional read status
}

export interface RecentAdminAction {
  id: string;
  userId: string; // ID of the admin user who performed the action, or 'system'
  action: string; // e.g., "User Suspended", "Currency Minted"
  details: string; // e.g., "User John Doe (user@example.com) suspended for ToS violation."
  timestamp: string; // ISO string format for date/time
}
