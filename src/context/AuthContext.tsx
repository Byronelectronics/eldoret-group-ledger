import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Member, AuthState, ROLE_PERMISSIONS, UserRole } from '@/types/group';

type PermissionsType = {
  canViewTotalBalance: boolean;
  canApproveTransactions: boolean;
  canEditTransactions: boolean;
  canRegisterMembers: boolean;
  canKeyInFinances: boolean;
  canSendNotifications: boolean;
  canManageMembers: boolean;
};

interface AuthContextType extends AuthState {
  login: (memberId: string, pin: string) => Promise<boolean>;
  logout: () => void;
  permissions: PermissionsType;
  isAdmin: boolean;
  isFinancialAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock members for demo - in production, this would come from database
const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    memberId: 'admin001',
    name: 'System Administrator',
    idNumber: '00000000',
    phoneNumber: '0700000000',
    pin: '1234',
    role: 'overall_admin',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '2',
    memberId: 'chair001',
    name: 'John Kiprop',
    idNumber: '12345678',
    phoneNumber: '0712345678',
    pin: '5678',
    role: 'chairman',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '3',
    memberId: 'treas001',
    name: 'Mary Chebet',
    idNumber: '23456789',
    phoneNumber: '0723456789',
    pin: '9012',
    role: 'treasurer',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '4',
    memberId: 'sec001',
    name: 'Peter Kiptoo',
    idNumber: '34567890',
    phoneNumber: '0734567890',
    pin: '3456',
    role: 'secretary',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '5',
    memberId: 'mem001',
    name: 'Grace Jepkosgei',
    idNumber: '45678901',
    phoneNumber: '0745678901',
    pin: '7890',
    role: 'member',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  const login = useCallback(async (memberId: string, pin: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const member = MOCK_MEMBERS.find(
      m => m.memberId.toLowerCase() === memberId.toLowerCase() && m.pin === pin && m.isActive
    );

    if (member) {
      setAuthState({
        isAuthenticated: true,
        currentUser: member,
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      currentUser: null,
    });
  }, []);

  const role: UserRole = authState.currentUser?.role || 'member';
  const permissions: PermissionsType = ROLE_PERMISSIONS[role];

  const isAdmin = authState.currentUser?.role !== 'member';
  
  const isFinancialAdmin = ['chairman', 'overall_admin', 'treasurer'].includes(
    authState.currentUser?.role || ''
  );

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      permissions,
      isAdmin,
      isFinancialAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
