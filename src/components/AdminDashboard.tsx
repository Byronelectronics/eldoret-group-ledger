import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Wallet, 
  FileText, 
  Bell, 
  UserPlus,
  DollarSign,
  Shield,
  TrendingUp
} from 'lucide-react';
import { ROLE_LABELS, Transaction } from '@/types/group';
import GroupLedger from './GroupLedger';
import MemberManagement from './MemberManagement';
import FinanceEntry from './FinanceEntry';
import NotificationCenter from './NotificationCenter';
import MemberRegistration from './MemberRegistration';

// Mock data for demo
const MOCK_ALL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    memberId: 'mem001',
    memberName: 'Grace Jepkosgei',
    amount: 5000,
    type: 'contribution',
    description: 'Monthly contribution - January',
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    approvedBy: 'Mary Chebet',
    approvedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: '2',
    memberId: 'mem001',
    memberName: 'Grace Jepkosgei',
    amount: 5000,
    type: 'contribution',
    description: 'Monthly contribution - February',
    status: 'approved',
    createdAt: '2024-02-15T09:00:00Z',
    approvedBy: 'Mary Chebet',
    approvedAt: '2024-02-15T09:30:00Z',
  },
  {
    id: '3',
    memberId: 'chair001',
    memberName: 'John Kiprop',
    amount: 10000,
    type: 'contribution',
    description: 'Monthly contribution - January',
    status: 'approved',
    createdAt: '2024-01-10T08:00:00Z',
    approvedBy: 'Mary Chebet',
    approvedAt: '2024-01-10T08:30:00Z',
  },
  {
    id: '4',
    memberId: 'treas001',
    memberName: 'Mary Chebet',
    amount: 7500,
    type: 'contribution',
    description: 'Monthly contribution - January',
    status: 'approved',
    createdAt: '2024-01-12T14:00:00Z',
    approvedBy: 'John Kiprop',
    approvedAt: '2024-01-12T14:30:00Z',
  },
  {
    id: '5',
    memberId: 'mem001',
    memberName: 'Grace Jepkosgei',
    amount: 5000,
    type: 'contribution',
    description: 'Monthly contribution - March',
    status: 'pending',
    createdAt: '2024-03-15T14:00:00Z',
  },
];

const AdminDashboard: React.FC = () => {
  const { currentUser, permissions, isFinancialAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const approvedTransactions = MOCK_ALL_TRANSACTIONS.filter(t => t.status === 'approved');
  const pendingTransactions = MOCK_ALL_TRANSACTIONS.filter(t => t.status === 'pending');
  
  const totalGroupBalance = approvedTransactions.reduce((sum, t) => 
    t.type === 'contribution' ? sum + t.amount : sum - t.amount, 0
  );

  const totalMembers = 5; // Mock count

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-admin-gold" />
          <span className="text-sm font-medium text-admin-gold">
            {ROLE_LABELS[currentUser?.role || 'member']}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name.split(' ')[0]}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Group Balance - Only visible to financial admins */}
        {permissions.canViewTotalBalance && (
          <Card className="col-span-2 bg-accent/20 border-accent/30 glow-accent">
            <CardHeader className="pb-2">
              <CardDescription className="text-accent-foreground/70 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Total Group Balance
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-accent">
                KES {totalGroupBalance.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-accent-foreground/70">
                Visible only to authorized administrators
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-xl font-bold text-foreground">{totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-foreground">{pendingTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xl font-bold text-foreground">{approvedTransactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <Bell className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-xl font-bold text-foreground">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1 bg-secondary/50">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            <FileText className="w-4 h-4 mr-1" />
            Ledger
          </TabsTrigger>
          
          {permissions.canRegisterMembers && (
            <TabsTrigger value="register" className="text-xs sm:text-sm">
              <UserPlus className="w-4 h-4 mr-1" />
              Add Member
            </TabsTrigger>
          )}
          
          {permissions.canKeyInFinances && (
            <TabsTrigger value="finance" className="text-xs sm:text-sm bg-accent/20 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <DollarSign className="w-4 h-4 mr-1" />
              Finance
            </TabsTrigger>
          )}
          
          {permissions.canManageMembers && (
            <TabsTrigger value="members" className="text-xs sm:text-sm">
              <Users className="w-4 h-4 mr-1" />
              Members
            </TabsTrigger>
          )}
          
          {permissions.canSendNotifications && (
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              <Bell className="w-4 h-4 mr-1" />
              Notify
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <GroupLedger 
            transactions={MOCK_ALL_TRANSACTIONS} 
            canEdit={permissions.canEditTransactions}
            canApprove={permissions.canApproveTransactions}
          />
        </TabsContent>

        {permissions.canRegisterMembers && (
          <TabsContent value="register" className="space-y-4">
            <MemberRegistration />
          </TabsContent>
        )}

        {permissions.canKeyInFinances && (
          <TabsContent value="finance" className="space-y-4">
            <FinanceEntry />
          </TabsContent>
        )}

        {permissions.canManageMembers && (
          <TabsContent value="members" className="space-y-4">
            <MemberManagement />
          </TabsContent>
        )}

        {permissions.canSendNotifications && (
          <TabsContent value="notifications" className="space-y-4">
            <NotificationCenter />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
