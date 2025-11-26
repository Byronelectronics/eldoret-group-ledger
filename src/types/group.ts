export type UserRole = 'chairman' | 'overall_admin' | 'treasurer' | 'secretary' | 'member';

export interface Member {
  id: string;
  memberId: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  pin: string;
  role: UserRole;
  passportPhotoUrl?: string;
  documentPhotoUrl?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: 'contribution' | 'withdrawal' | 'expense' | 'loan';
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  createdAt: string;
  createdBy: string;
  readBy: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Member | null;
}

export const ROLE_PERMISSIONS = {
  chairman: {
    canViewTotalBalance: true,
    canApproveTransactions: true,
    canEditTransactions: true,
    canRegisterMembers: false,
    canKeyInFinances: false,
    canSendNotifications: true,
    canManageMembers: true,
  },
  overall_admin: {
    canViewTotalBalance: true,
    canApproveTransactions: true,
    canEditTransactions: true,
    canRegisterMembers: true,
    canKeyInFinances: false,
    canSendNotifications: true,
    canManageMembers: true,
  },
  treasurer: {
    canViewTotalBalance: true,
    canApproveTransactions: true,
    canEditTransactions: true,
    canRegisterMembers: false,
    canKeyInFinances: true,
    canSendNotifications: true,
    canManageMembers: false,
  },
  secretary: {
    canViewTotalBalance: false,
    canApproveTransactions: false,
    canEditTransactions: false,
    canRegisterMembers: true,
    canKeyInFinances: false,
    canSendNotifications: true,
    canManageMembers: false,
  },
  member: {
    canViewTotalBalance: false,
    canApproveTransactions: false,
    canEditTransactions: false,
    canRegisterMembers: false,
    canKeyInFinances: false,
    canSendNotifications: false,
    canManageMembers: false,
  },
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  chairman: 'Chairman',
  overall_admin: 'Overall Admin',
  treasurer: 'Treasurer',
  secretary: 'Secretary',
  member: 'Member',
};
